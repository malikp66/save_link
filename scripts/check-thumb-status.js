const { Client } = require('pg');
require('dotenv').config();

async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const byPlatform = await client.query(`
    SELECT s.platform, count(*) as count
    FROM saved_links s 
    JOIN media_storage m ON m.link_id = s.id AND m.media_type = 'thumbnail'
    WHERE m.content_type = 'image/svg+xml'
    GROUP BY s.platform
  `);
  console.log('Placeholders by platform:', byPlatform.rows);

  const sample = await client.query(`
    SELECT s.id, s.platform, s.url, s.title
    FROM saved_links s 
    JOIN media_storage m ON m.link_id = s.id AND m.media_type = 'thumbnail'
    WHERE m.content_type = 'image/svg+xml'
    ORDER BY s.id
    LIMIT 25
  `);
  console.log('Sample placeholders:', sample.rows);

  await client.end();
}

check();
