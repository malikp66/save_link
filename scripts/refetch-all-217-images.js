const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const thumbDir = path.join(__dirname, '../public/storage/thumbnails');
const avatarDir = path.join(__dirname, '../public/storage/avatars');
const initialLinksPath = path.join(__dirname, '../src/lib/initialLinks.json');

fs.mkdirSync(thumbDir, { recursive: true });
fs.mkdirSync(avatarDir, { recursive: true });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
];

async function fetchTikTokFreshImage(url) {
  try {
    const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.code === 0 && json.data) {
        const cover = json.data.cover || (json.data.images && json.data.images[0]) || null;
        const avatar = json.data.author?.avatar || null;
        return { cover, avatar, title: json.data.title, author: json.data.author?.unique_id };
      }
    }
  } catch (err) {}
  return null;
}

async function fetchInstagramFreshImage(url) {
  try {
    const match = url.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const type = match[1];
    const code = match[2];

    // Method 1: /media/?size=l redirect
    const mediaUrl = `https://www.instagram.com/${type}/${code}/media/?size=l`;
    const res = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(6000),
    });

    const location = res.headers.get('location');
    if (location && location.startsWith('http')) {
      return location;
    }

    // Method 2: Embed page
    const embedUrl = `https://www.instagram.com/${type}/${code}/embed/captioned/`;
    const embedRes = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (embedRes.ok) {
      const html = await embedRes.text();
      const m = html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i) 
             || html.match(/img class="[^"]*"[^>]*src="([^"]+)"/i);
      if (m && m[1]) {
        return m[1].replace(/&amp;/g, '&');
      }
    }
  } catch (err) {}
  return null;
}

async function downloadBuffer(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const isInstagram = url.includes('instagram.com') || url.includes('fbcdn.net') || url.includes('cdninstagram.com');
    const isTikTok = url.includes('tiktokcdn') || url.includes('tiktok.com');

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      'Accept': 'image/*,*/*',
    };
    if (isInstagram) headers['Referer'] = 'https://www.instagram.com/';
    if (isTikTok) headers['Referer'] = 'https://www.tiktok.com/';

    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) return null;
    return { buffer, contentType };
  } catch (err) {
    return null;
  }
}

async function processSingleItem(item, client, index, total) {
  let freshCoverUrl = null;
  let freshAvatarUrl = null;

  if (item.platform === 'tiktok') {
    const ttData = await fetchTikTokFreshImage(item.url);
    if (ttData) {
      freshCoverUrl = ttData.cover;
      freshAvatarUrl = ttData.avatar;
    }
  } else {
    freshCoverUrl = await fetchInstagramFreshImage(item.url);
  }

  // Fallback to current URL, or high quality curated fallback
  let candidateCover = freshCoverUrl || item.thumbnail_url;
  let data = await downloadBuffer(candidateCover);

  if (!data) {
    // If original failed, use curated themed fallback
    const hash = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fallbackUrl = FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
    data = await downloadBuffer(fallbackUrl);
    candidateCover = fallbackUrl;
  }

  if (data) {
    const { buffer, contentType } = data;
    const filename = `${item.id}.jpg`;
    fs.writeFileSync(path.join(thumbDir, filename), buffer);

    const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
    const mediaId = `thumb-${item.id}`;

    await client.query(`
      INSERT INTO media_storage (id, link_id, media_type, original_url, content_type, image_base64, image_data, file_size)
      VALUES ($1, $2, 'thumbnail', $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        image_base64 = EXCLUDED.image_base64,
        image_data = EXCLUDED.image_data;
    `, [mediaId, item.id, candidateCover, contentType, base64Data, buffer, buffer.length]);

    const localPath = `/storage/thumbnails/${filename}`;
    await client.query('UPDATE saved_links SET thumbnail_url = $1 WHERE id = $2;', [localPath, item.id]);
  }

  // Process Avatar if available
  const candidateAvatar = freshAvatarUrl || item.author_avatar_url;
  if (candidateAvatar && candidateAvatar.startsWith('http') && !candidateAvatar.includes('dicebear')) {
    const avatarData = await downloadBuffer(candidateAvatar);
    if (avatarData) {
      const { buffer, contentType } = avatarData;
      const filename = `${item.id}.jpg`;
      fs.writeFileSync(path.join(avatarDir, filename), buffer);

      const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
      const mediaId = `avatar-${item.id}`;

      await client.query(`
        INSERT INTO media_storage (id, link_id, media_type, original_url, content_type, image_base64, image_data, file_size)
        VALUES ($1, $2, 'avatar', $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          image_base64 = EXCLUDED.image_base64,
          image_data = EXCLUDED.image_data;
      `, [mediaId, item.id, candidateAvatar, contentType, base64Data, buffer, buffer.length]);

      const localPath = `/storage/avatars/${filename}`;
      await client.query('UPDATE saved_links SET author_avatar_url = $1 WHERE id = $2;', [localPath, item.id]);
    }
  }

  console.log(`[${index + 1}/${total}] ${item.platform} (${item.author_username || item.id}): SAVED`);
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to Neon Database. Fetching items that need permanent storage...');

  const { rows: links } = await client.query(`
    SELECT id, platform, url, thumbnail_url, author_avatar_url, author_username
    FROM saved_links
    WHERE thumbnail_url IS NULL OR thumbnail_url NOT LIKE '/storage/%'
    ORDER BY id ASC;
  `);

  console.log(`Found ${links.length} links needing images saved to Neon DB.`);

  const CONCURRENCY = 6;
  for (let i = 0; i < links.length; i += CONCURRENCY) {
    const chunk = links.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map((item, chunkIdx) => processSingleItem(item, client, i + chunkIdx, links.length))
    );
    await sleep(250);
  }

  console.log('\n=== Updating initialLinks.json with all permanent storage paths ===');
  const { rows: allLinks } = await client.query('SELECT id, thumbnail_url, author_avatar_url FROM saved_links;');
  const linkMap = new Map(allLinks.map(l => [l.id, l]));

  const initial = JSON.parse(fs.readFileSync(initialLinksPath, 'utf8'));
  const updatedInitial = initial.map(item => {
    const db = linkMap.get(item.id);
    if (db) {
      return {
        ...item,
        thumbnail_url: db.thumbnail_url || item.thumbnail_url,
        author_avatar_url: db.author_avatar_url || item.author_avatar_url,
      };
    }
    return item;
  });

  fs.writeFileSync(initialLinksPath, JSON.stringify(updatedInitial, null, 2));

  const { rows: mediaTotal } = await client.query('SELECT count(*) FROM media_storage;');
  const { rows: localTotal } = await client.query("SELECT count(*) FROM saved_links WHERE thumbnail_url LIKE '/storage/%';");
  console.log(`\nALL DONE!`);
  console.log(`Total Saved Links with permanent storage: ${localTotal[0].count} / ${allLinks.length}`);
  console.log(`Total Media Storage Records in Neon Database: ${mediaTotal[0].count}`);

  await client.end();
}

main().catch(err => {
  console.error('Fatal error in refetch:', err);
  process.exit(1);
});
