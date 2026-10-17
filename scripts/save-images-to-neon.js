const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const thumbDir = path.join(__dirname, '../public/storage/thumbnails');
const avatarDir = path.join(__dirname, '../public/storage/avatars');

fs.mkdirSync(thumbDir, { recursive: true });
fs.mkdirSync(avatarDir, { recursive: true });

async function downloadBuffer(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'image/*,*/*',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 400) return null;
    return { buffer, contentType };
  } catch (err) {
    return null;
  }
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to Neon Database. Fetching saved links to store images in Neon media_storage...');

  const { rows: links } = await client.query('SELECT id, thumbnail_url, author_avatar_url, author_username FROM saved_links;');
  console.log(`Found ${links.length} links to process images for.`);

  let savedImages = 0;

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    process.stdout.write(`[${i + 1}/${links.length}] Saving media for ${link.author_username}... `);

    // 1. Process Thumbnail
    if (link.thumbnail_url && link.thumbnail_url.startsWith('http')) {
      const data = await downloadBuffer(link.thumbnail_url);
      if (data) {
        const { buffer, contentType } = data;
        const filename = `${link.id}.jpg`;
        fs.writeFileSync(path.join(thumbDir, filename), buffer);

        const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
        const mediaId = `thumb-${link.id}`;

        await client.query(`
          INSERT INTO media_storage (id, link_id, media_type, original_url, content_type, image_base64, image_data, file_size)
          VALUES ($1, $2, 'thumbnail', $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            image_base64 = EXCLUDED.image_base64,
            image_data = EXCLUDED.image_data;
        `, [mediaId, link.id, link.thumbnail_url, contentType, base64Data, buffer, buffer.length]);

        // Update link thumbnail_url to local storage path
        await client.query('UPDATE saved_links SET thumbnail_url = $1 WHERE id = $2;', [
          `/storage/thumbnails/${filename}`,
          link.id,
        ]);
        savedImages++;
      }
    }

    // 2. Process Avatar
    if (link.author_avatar_url && link.author_avatar_url.startsWith('http') && !link.author_avatar_url.includes('dicebear')) {
      const data = await downloadBuffer(link.author_avatar_url);
      if (data) {
        const { buffer, contentType } = data;
        const filename = `${link.id}.jpg`;
        fs.writeFileSync(path.join(avatarDir, filename), buffer);

        const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
        const mediaId = `avatar-${link.id}`;

        await client.query(`
          INSERT INTO media_storage (id, link_id, media_type, original_url, content_type, image_base64, image_data, file_size)
          VALUES ($1, $2, 'avatar', $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            image_base64 = EXCLUDED.image_base64,
            image_data = EXCLUDED.image_data;
        `, [mediaId, link.id, link.author_avatar_url, contentType, base64Data, buffer, buffer.length]);

        await client.query('UPDATE saved_links SET author_avatar_url = $1 WHERE id = $2;', [
          `/storage/avatars/${filename}`,
          link.id,
        ]);
        savedImages++;
      }
    }

    console.log('DONE');
  }

  const { rows: countRows } = await client.query('SELECT count(*) FROM media_storage;');
  console.log(`\nAll images processed! Total media storage records saved in Neon DB: ${countRows[0].count}`);

  // Also update initialLinks.json with the new /storage/ paths
  const initialLinksPath = path.join(__dirname, '../src/lib/initialLinks.json');
  const initial = JSON.parse(fs.readFileSync(initialLinksPath, 'utf8'));
  const { rows: updatedLinks } = await client.query('SELECT id, thumbnail_url, author_avatar_url FROM saved_links;');
  const linkMap = new Map(updatedLinks.map(l => [l.id, l]));

  const syncedInitial = initial.map(item => {
    const dbItem = linkMap.get(item.id);
    if (dbItem) {
      return {
        ...item,
        thumbnail_url: dbItem.thumbnail_url || item.thumbnail_url,
        author_avatar_url: dbItem.author_avatar_url || item.author_avatar_url,
      };
    }
    return item;
  });

  fs.writeFileSync(initialLinksPath, JSON.stringify(syncedInitial, null, 2));
  console.log('Updated initialLinks.json with permanent local & Neon storage paths.');

  await client.end();
}

main().catch(err => {
  console.error('Error saving images to Neon:', err);
  process.exit(1);
});
