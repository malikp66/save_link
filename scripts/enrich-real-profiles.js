const fs = require('fs');
const path = require('path');

const linksPath = path.join(__dirname, 'parsed-user-links.json');
const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

async function resolveTiktokUrl(shortUrl) {
  try {
    const res = await fetch(shortUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
    });
    const finalUrl = res.url;
    const m = finalUrl.match(/@([^/?#]+)/);
    const username = m ? m[1] : null;

    let authorName = username;
    let title = null;
    let thumb = null;

    // Try oEmbed
    if (finalUrl.includes('tiktok.com/@')) {
      try {
        const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl)}`, {
          signal: AbortSignal.timeout(4000),
        });
        if (oembedRes.ok) {
          const oe = await oembedRes.json();
          authorName = oe.author_name || authorName;
          title = oe.title || title;
          thumb = oe.thumbnail_url || thumb;
        }
      } catch (e) {}
    }

    return { canonicalUrl: finalUrl, username, authorName, title, thumb };
  } catch (err) {
    return null;
  }
}

async function runBatch() {
  console.log(`Resolving real creator usernames for ${links.length} links...`);
  
  // Concurrency worker
  let completed = 0;
  const BATCH_SIZE = 8;
  
  for (let i = 0; i < links.length; i += BATCH_SIZE) {
    const chunk = links.slice(i, i + BATCH_SIZE);
    await Promise.all(
      chunk.map(async (item) => {
        if (item.platform === 'tiktok' && item.url.includes('vt.tiktok.com')) {
          const res = await resolveTiktokUrl(item.url);
          if (res && res.username) {
            item.author_username = res.username;
            item.author_name = res.authorName || res.username;
            item.author_profile_url = `https://www.tiktok.com/@${res.username}`;
            item.author_avatar_url = `https://api.dicebear.com/7.x/personas/svg?seed=${res.username}`;
            if (res.title) item.title = res.title;
            if (res.thumb) item.thumbnail_url = res.thumb;
          }
        } else if (item.platform === 'instagram') {
          // Instagram link analysis
          const profileMatch = item.url.match(/instagram\.com\/([a-zA-Z0-9_.-]+)\/?(\?.*)?$/);
          if (profileMatch && !['p', 'reel', 'stories', 'explore'].includes(profileMatch[1])) {
            const igUser = profileMatch[1];
            item.author_username = igUser;
            item.author_name = igUser.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            item.author_profile_url = `https://www.instagram.com/${igUser}/`;
            item.author_avatar_url = `https://api.dicebear.com/7.x/personas/svg?seed=${igUser}`;
            item.title = `Profil Resmi Instagram @${igUser}`;
          }
        }
        completed++;
      })
    );
    process.stdout.write(`\rProgress: ${completed}/${links.length} resolved`);
  }

  console.log('\nFinished resolving creator usernames!');

  // Analyze duplicate profiles!
  const profilesMap = {};
  for (const item of links) {
    const u = item.author_username.toLowerCase();
    if (!profilesMap[u]) {
      profilesMap[u] = {
        username: item.author_username,
        platform: item.platform,
        count: 0,
        links: [],
      };
    }
    profilesMap[u].count++;
    profilesMap[u].links.push(item.url);
  }

  const multiContentProfiles = Object.values(profilesMap).filter((p) => p.count > 1);
  console.log(`Unique creators found: ${Object.keys(profilesMap).length}`);
  console.log(`Creators with MULTIPLE saved contents: ${multiContentProfiles.length}`);
  for (const p of multiContentProfiles) {
    console.log(` - @${p.username} (${p.platform}): ${p.count} konten tersimpan`);
  }

  // Save updated resolved data
  fs.writeFileSync(path.join(__dirname, 'parsed-user-links.json'), JSON.stringify(links, null, 2));
  fs.writeFileSync(path.join(__dirname, '../src/lib/initialLinks.json'), JSON.stringify(links, null, 2));
  console.log('Saved enriched dataset to src/lib/initialLinks.json!');
}

runBatch();
