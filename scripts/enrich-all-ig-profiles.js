const fs = require('fs');
const path = require('path');

const linksPath = path.join(__dirname, 'parsed-user-links.json');
const destPath = path.join(__dirname, '../src/lib/initialLinks.json');

const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function parseCountString(str) {
  if (!str) return 0;
  const clean = str.replace(/,/g, '').trim();
  const multiplierMatch = clean.match(/^([\d.]+)\s*([KMkm]?)$/);
  if (!multiplierMatch) return parseInt(clean) || 0;
  const num = parseFloat(multiplierMatch[1]);
  const suffix = multiplierMatch[2].toUpperCase();
  if (suffix === 'K') return Math.round(num * 1000);
  if (suffix === 'M') return Math.round(num * 1000000);
  return Math.round(num);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeIgProfile(username) {
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const html = await res.text();
      const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i) || html.match(/<title>([^<]+)<\/title>/i);
      const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
      const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);

      const ogTitle = titleMatch ? decodeHtmlEntities(titleMatch[1]) : '';
      const ogDesc = descMatch ? decodeHtmlEntities(descMatch[1]) : '';
      const ogImage = imageMatch ? imageMatch[1] : '';

      const displayNameMatch = ogTitle.match(/^(.+?)\s*\(@/);
      const displayName = displayNameMatch ? displayNameMatch[1].trim() : username;

      const followersMatch = ogDesc.match(/([\d,.]+[KMkm]?)\s*Followers/i);
      const followingMatch = ogDesc.match(/([\d,.]+[KMkm]?)\s*Following/i);
      const postsMatch = ogDesc.match(/([\d,.]+)\s*Posts/i);

      const followersStr = followersMatch ? followersMatch[1] : '0';
      const followersCount = parseCountString(followersStr);
      const postsCount = postsMatch ? parseInt(postsMatch[1].replace(/,/g, '')) : 0;
      const followingCount = followingMatch ? parseCountString(followingMatch[1]) : 0;

      return {
        displayName,
        followersCount,
        followersStr,
        postsCount,
        followingCount,
        profilePic: ogImage || null,
        title: `Profil @${username} — ${displayName} (${followersStr} Followers, ${postsCount} Posts)`,
      };
    }
  } catch (e) {
    console.warn(`Failed to scrape IG profile @${username}:`, e.message);
  }
  return null;
}

async function main() {
  console.log('Starting Instagram Profile enrichment...');

  const profileLinks = links.filter(
    (l) => l.platform === 'instagram' && (!l.url.includes('/p/') && !l.url.includes('/reel/'))
  );

  console.log(`Found ${profileLinks.length} Instagram profile links to enrich.`);

  let successCount = 0;
  for (let i = 0; i < profileLinks.length; i++) {
    const item = profileLinks[i];
    console.log(`[${i + 1}/${profileLinks.length}] Scraping IG Profile: @${item.author_username}`);

    const data = await scrapeIgProfile(item.author_username);
    if (data) {
      item.media_type = 'profile';
      item.author_name = data.displayName;
      if (data.profilePic) {
        item.author_avatar_url = data.profilePic;
        item.thumbnail_url = data.profilePic;
      }
      item.title = data.title;
      item.views_count = data.followersCount;
      item.likes_count = data.postsCount;
      item.comments_count = data.followingCount;
      successCount++;
      console.log(` -> SUCCESS: ${data.displayName} | ${data.followersStr} Followers | ${data.postsCount} Posts`);
    } else {
      console.log(` -> Fallback kept for @${item.author_username}`);
    }

    await sleep(1000);
  }

  console.log(`\nEnrichment complete! ${successCount}/${profileLinks.length} IG profiles updated.`);
  fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
  fs.writeFileSync(destPath, JSON.stringify(links, null, 2));
}

main();
