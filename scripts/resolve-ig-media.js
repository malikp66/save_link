const fs = require('fs');
const path = require('path');

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

async function fetchOg(url) {
  const uas = [
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Twitterbot/1.0',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  ];

  for (const ua of uas) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const html = await res.text();
        const titleMatch = html.match(/<meta property=["']og:title["'] content=["']([^"']+)["']/i) || html.match(/<title>([^<]+)<\/title>/i);
        const descMatch = html.match(/<meta property=["']og:description["'] content=["']([^"']+)["']/i);
        const imageMatch = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);

        const ogTitle = titleMatch ? decodeHtmlEntities(titleMatch[1]) : '';
        const ogDesc = descMatch ? decodeHtmlEntities(descMatch[1]) : '';
        const ogImage = imageMatch ? decodeHtmlEntities(imageMatch[1]) : '';

        if (ogImage || ogTitle || ogDesc) {
          return { ogTitle, ogDesc, ogImage };
        }
      }
    } catch (e) {}
  }
  return null;
}

// Cache avatar by username so we don't re-fetch the same profile 10 times
const avatarCache = new Map();

async function getProfileAvatar(username) {
  if (!username || username === 'ig_creator' || username.startsWith('creator_')) return null;
  if (avatarCache.has(username)) return avatarCache.get(username);

  const og = await fetchOg(`https://www.instagram.com/${username}/`);
  if (og && og.ogImage) {
    avatarCache.set(username, og.ogImage);
    return og.ogImage;
  }
  return null;
}

async function resolveAllInstagram() {
  const linksPath = path.join(__dirname, '../src/lib/initialLinks.json');
  const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

  const igLinks = links.filter(l => l.platform === 'instagram');
  console.log(`Starting real resolution for ${igLinks.length} Instagram links...`);

  let resolvedCount = 0;
  const BATCH_SIZE = 5;

  for (let i = 0; i < igLinks.length; i += BATCH_SIZE) {
    const chunk = igLinks.slice(i, i + BATCH_SIZE);
    await Promise.all(
      chunk.map(async (item) => {
        try {
          const cleanUrl = item.url.trim().split('?')[0];
          const isReel = cleanUrl.includes('/reel/') || cleanUrl.includes('/reels/');
          const isPost = cleanUrl.includes('/p/');
          const isProfile = !isReel && !isPost;

          const og = await fetchOg(cleanUrl);
          if (og) {
            if (isProfile) {
              const uMatch = cleanUrl.match(/instagram\.com\/([^/?#]+)/);
              const username = uMatch ? uMatch[1] : item.author_username;
              const nameMatch = og.ogTitle.match(/^(.+?)\s*\(@/);
              if (nameMatch) item.author_name = nameMatch[1].trim();
              if (username) {
                item.author_username = username;
                item.author_profile_url = `https://www.instagram.com/${username}/`;
              }
              if (og.ogImage) {
                item.author_avatar_url = og.ogImage;
                item.thumbnail_url = og.ogImage;
              }
              if (og.ogDesc) {
                item.title = og.ogDesc;
              }
              resolvedCount++;
            } else {
              // Post / Reel
              if (og.ogImage) {
                item.thumbnail_url = og.ogImage;
              }

              // Extract username
              const userMatch = og.ogDesc.match(/(?:-\s*|^)([a-zA-Z0-9._]+)\s*(?:on\s+[A-Za-z]+|\:)/i)
                || og.ogDesc.match(/from\s+([a-zA-Z0-9._]+)\s*\(@/i)
                || og.ogTitle.match(/\(@([a-zA-Z0-9._]+)\)/i);
              
              if (userMatch) {
                item.author_username = userMatch[1];
                item.author_profile_url = `https://www.instagram.com/${userMatch[1]}/`;
              }

              // Extract name
              const nameMatch = og.ogTitle.match(/^(.+?)\s*(?:\(@[a-zA-Z0-9._]+\))?\s*on Instagram/i)
                || og.ogTitle.match(/^(.+?)\s*\(@/i);
              if (nameMatch) {
                item.author_name = nameMatch[1].trim();
              }

              // Extract caption
              const captionMatch = og.ogDesc.match(/:\s*["“]?([^"”]+)["”]?/);
              if (captionMatch && captionMatch[1]) {
                item.title = captionMatch[1].trim();
              }

              // Now fetch real profile avatar
              const avatar = await getProfileAvatar(item.author_username);
              if (avatar) {
                item.author_avatar_url = avatar;
              } else if (og.ogImage) {
                item.author_avatar_url = og.ogImage;
              }

              resolvedCount++;
            }
          }
        } catch (err) {
          console.warn(`Error on ${item.id}:`, err.message);
        }
      })
    );
    process.stdout.write(`\rProgress: ${Math.min(i + BATCH_SIZE, igLinks.length)}/${igLinks.length} processed (${resolvedCount} successfully fetched real photos)`);
  }

  console.log('\nWriting back to files...');
  fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));

  const parsedUserLinksPath = path.join(__dirname, 'parsed-user-links.json');
  if (fs.existsSync(parsedUserLinksPath)) {
    fs.writeFileSync(parsedUserLinksPath, JSON.stringify(links, null, 2));
  }

  console.log(`Finished! Updated ${resolvedCount} Instagram links with real photos and avatars.`);
}

resolveAllInstagram();
