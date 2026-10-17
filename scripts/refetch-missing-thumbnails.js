const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const thumbDir = path.join(__dirname, '../public/storage/thumbnails');
const avatarDir = path.join(__dirname, '../public/storage/avatars');
fs.mkdirSync(thumbDir, { recursive: true });
fs.mkdirSync(avatarDir, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

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

async function downloadImageBuffer(url, referer) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Referer': referer || 'https://www.google.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) return null; // Filter out 0 byte or empty responses
    return { buffer, contentType };
  } catch (e) {
    return null;
  }
}

async function fetchTikTokData(url) {
  // Try TikWM direct
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url));
      const json = await res.json();
      if (json.code === 0 && json.data) {
        return {
          cover: json.data.cover,
          avatar: json.data.author?.avatar,
          author: json.data.author?.unique_id,
          name: json.data.author?.nickname,
          title: json.data.title
        };
      } else if (json.msg && json.msg.includes('limit')) {
        await sleep(2500);
      }
    } catch (e) {}
    await sleep(1500);
  }

  // Try unshortening
  try {
    const red = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const loc = red.headers.get('location');
    if (loc) {
      const cleanLoc = loc.split('?')[0];
      await sleep(1500);
      const res2 = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(cleanLoc));
      const json2 = await res2.json();
      if (json2.code === 0 && json2.data) {
        return {
          cover: json2.data.cover,
          avatar: json2.data.author?.avatar,
          author: json2.data.author?.unique_id,
          name: json2.data.author?.nickname,
          title: json2.data.title
        };
      }
    }
  } catch (e) {}

  return null;
}

async function fetchIgProfile(username) {
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const html = await res.text();
    const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);

    if (ogImg && ogImg[1]) {
      const imgUrl = decodeHtmlEntities(ogImg[1]);
      const title = ogTitle ? decodeHtmlEntities(ogTitle[1]) : '';
      const desc = ogDesc ? decodeHtmlEntities(ogDesc[1]) : '';
      const displayNameMatch = title.match(/^(.+?)\s*\(@/);
      const displayName = displayNameMatch ? displayNameMatch[1].trim() : username;

      return {
        profilePic: imgUrl,
        displayName,
        title: desc || title
      };
    }
  } catch (e) {}
  return null;
}

async function fetchIgPost(url) {
  const match = url.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
  const code = match ? match[2] : '';
  if (!code) return null;

  // Try /media/?size=l
  try {
    const mRes = await fetch(`https://www.instagram.com/p/${code}/media/?size=l`, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const loc = mRes.headers.get('location');
    if (loc && loc.startsWith('http')) {
      return { cover: loc };
    }
  } catch (e) {}

  // Try FacebookBot OpenGraph
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(7000)
    });
    if (res.ok) {
      const html = await res.text();
      const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (ogImg && ogImg[1]) {
        return { cover: decodeHtmlEntities(ogImg[1]) };
      }
    }
  } catch (e) {}

  return null;
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('Connected to Neon PostgreSQL database.');

  // Find all links that have SVG placeholders in media_storage
  const { rows: targets } = await client.query(`
    SELECT s.id, s.platform, s.url, s.author_username, s.author_name, s.title
    FROM saved_links s
    JOIN media_storage m ON m.link_id = s.id AND m.media_type = 'thumbnail'
    WHERE m.content_type = 'image/svg+xml'
    ORDER BY s.platform, s.id;
  `);

  console.log(`Found ${targets.length} links with SVG placeholders to re-fetch.`);

  let recoveredCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const item = targets[i];
    console.log(`\n[${i + 1}/${targets.length}] [${item.platform.toUpperCase()}] ${item.id} -> ${item.url}`);

    let imgData = null;
    let avatarData = null;
    let newTitle = null;
    let newAuthor = null;
    let newAuthorName = null;

    if (item.platform === 'tiktok') {
      const tt = await fetchTikTokData(item.url);
      if (tt && tt.cover) {
        console.log(`  Found TikTok cover for @${tt.author}: ${tt.cover.substring(0, 50)}...`);
        imgData = await downloadImageBuffer(tt.cover, 'https://www.tiktok.com/');
        if (tt.avatar) {
          avatarData = await downloadImageBuffer(tt.avatar, 'https://www.tiktok.com/');
        }
        if (tt.title && tt.title.trim().length > 3) newTitle = tt.title.trim();
        if (tt.author) newAuthor = tt.author;
        if (tt.name) newAuthorName = tt.name;
      } else {
        console.log(`  ⚠️ TikTok content could not be retrieved (private or unavailable).`);
      }
      await sleep(1500); // 1.5s delay to keep TikWM happy
    } else if (item.platform === 'instagram') {
      const isPost = item.url.includes('/p/') || item.url.includes('/reel/');
      if (isPost) {
        const postData = await fetchIgPost(item.url);
        if (postData && postData.cover) {
          console.log(`  Found IG Post cover: ${postData.cover.substring(0, 50)}...`);
          imgData = await downloadImageBuffer(postData.cover, 'https://www.instagram.com/');
        }
        // If post cover not found, try getting author profile picture as thumbnail
        if (!imgData && item.author_username && !item.author_username.startsWith('creator_')) {
          console.log(`  Attempting author profile avatar for @${item.author_username}...`);
          const prof = await fetchIgProfile(item.author_username);
          if (prof && prof.profilePic) {
            imgData = await downloadImageBuffer(prof.profilePic, 'https://www.instagram.com/');
            avatarData = imgData;
          }
        }
      } else {
        // Profile link
        const uMatch = item.url.match(/instagram\.com\/([^/?#]+)/);
        const username = uMatch ? uMatch[1] : item.author_username;
        if (username) {
          const prof = await fetchIgProfile(username);
          if (prof && prof.profilePic) {
            console.log(`  Found IG Profile pic for @${username}`);
            imgData = await downloadImageBuffer(prof.profilePic, 'https://www.instagram.com/');
            avatarData = imgData;
            if (prof.displayName) newAuthorName = prof.displayName;
            if (prof.title) newTitle = prof.title;
          }
        }
      }
      await sleep(1200);
    }

    // If we recovered a real image, store it permanently!
    if (imgData && imgData.buffer) {
      const { buffer, contentType } = imgData;
      const filename = `${item.id}.jpg`;
      fs.writeFileSync(path.join(thumbDir, filename), buffer);

      const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
      const mediaId = `thumb-${item.id}`;

      // Update media_storage in Neon
      await client.query(`
        INSERT INTO media_storage (id, link_id, media_type, original_url, content_type, image_base64, image_data, file_size)
        VALUES ($1, $2, 'thumbnail', $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          content_type = EXCLUDED.content_type,
          image_base64 = EXCLUDED.image_base64,
          image_data = EXCLUDED.image_data,
          file_size = EXCLUDED.file_size;
      `, [mediaId, item.id, item.url, contentType, base64Data, buffer, buffer.length]);

      // Update saved_links
      const localThumbPath = `/storage/thumbnails/${filename}`;
      await client.query(`
        UPDATE saved_links
        SET thumbnail_url = $1,
            author_username = COALESCE($2, author_username),
            author_name = COALESCE($3, author_name),
            title = COALESCE($4, title)
        WHERE id = $5;
      `, [localThumbPath, newAuthor || null, newAuthorName || null, newTitle || null, item.id]);

      // If avatar also downloaded
      if (avatarData && avatarData.buffer) {
        const avFilename = `${item.id}.jpg`;
        fs.writeFileSync(path.join(avatarDir, avFilename), avatarData.buffer);
        const avBase64 = `data:${avatarData.contentType};base64,${avatarData.buffer.toString('base64')}`;
        const avMediaId = `avatar-${item.id}`;

        await client.query(`
          INSERT INTO media_storage (id, link_id, media_type, original_url, content_type, image_base64, image_data, file_size)
          VALUES ($1, $2, 'avatar', $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            content_type = EXCLUDED.content_type,
            image_base64 = EXCLUDED.image_base64,
            image_data = EXCLUDED.image_data,
            file_size = EXCLUDED.file_size;
        `, [avMediaId, item.id, item.url, avatarData.contentType, avBase64, avatarData.buffer, avatarData.buffer.length]);

        await client.query(`
          UPDATE saved_links
          SET author_avatar_url = $1
          WHERE id = $2;
        `, [`/storage/avatars/${avFilename}`, item.id]);
      }

      recoveredCount++;
      console.log(`  🎉 SUCCESS: Recovered & saved image for ${item.id} (${buffer.length} bytes)!`);
    } else {
      console.log(`  ℹ️ Maintained aesthetic placeholder for ${item.id}.`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Re-fetch complete! Successfully recovered ${recoveredCount} / ${targets.length} thumbnails.`);

  // Sync to initialLinks.json
  const initialLinksPath = path.join(__dirname, '../src/lib/initialLinks.json');
  const initial = JSON.parse(fs.readFileSync(initialLinksPath, 'utf8'));
  const { rows: updatedLinks } = await client.query('SELECT id, thumbnail_url, author_avatar_url, author_username, author_name, title FROM saved_links;');
  const linkMap = new Map(updatedLinks.map(l => [l.id, l]));

  const syncedInitial = initial.map(item => {
    const dbItem = linkMap.get(item.id);
    if (dbItem) {
      return {
        ...item,
        thumbnail_url: dbItem.thumbnail_url || item.thumbnail_url,
        author_avatar_url: dbItem.author_avatar_url || item.author_avatar_url,
        author_username: dbItem.author_username || item.author_username,
        author_name: dbItem.author_name || item.author_name,
        title: dbItem.title || item.title
      };
    }
    return item;
  });

  fs.writeFileSync(initialLinksPath, JSON.stringify(syncedInitial, null, 2));
  console.log('Synchronized updated links to src/lib/initialLinks.json.');

  await client.end();
}

main().catch(err => {
  console.error('Fatal error during refetch:', err);
  process.exit(1);
});
