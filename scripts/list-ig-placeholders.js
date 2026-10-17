const { Client } = require('pg');
require('dotenv').config();

async function listIgPlaceholders() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows } = await client.query(`
    SELECT s.id, s.url, s.author_username, s.title
    FROM saved_links s
    JOIN media_storage m ON m.link_id = s.id AND m.media_type = 'thumbnail'
    WHERE m.content_type = 'image/svg+xml' AND s.platform = 'instagram'
    ORDER BY s.id;
  `);

  console.log(`Found ${rows.length} Instagram links with SVG placeholders:`);
  rows.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.id}] ${r.author_username}: ${r.url}`);
  });

  await client.end();
}

listIgPlaceholders();
