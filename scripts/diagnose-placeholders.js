const { Client } = require('pg');
require('dotenv').config();
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function diagnose() {
  await client.connect();
  const { rows } = await client.query(`
    SELECT s.id, s.platform, s.url, s.author_username, s.title, m.content_type
    FROM saved_links s
    JOIN media_storage m ON m.link_id = s.id AND m.media_type = 'thumbnail'
    WHERE m.content_type = 'image/svg+xml'
    LIMIT 20;
  `);

  console.log(`Total placeholder links in sample: ${rows.length}`);
  console.table(rows.map(r => ({
    id: r.id,
    platform: r.platform,
    user: r.author_username,
    url: r.url.substring(0, 50),
    title: (r.title || '').substring(0, 40),
  })));

  await client.end();
}

diagnose();
