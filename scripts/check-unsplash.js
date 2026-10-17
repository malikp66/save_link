const { Client } = require('pg');
require('dotenv').config();
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function check() {
  await client.connect();
  const { rows } = await client.query("SELECT id, link_id, original_url FROM media_storage WHERE original_url LIKE '%unsplash%';");
  console.log('Media storage rows with unsplash:', rows.length);
  rows.forEach(r => console.log(r.id, r.link_id, r.original_url));
  await client.end();
}
check();
