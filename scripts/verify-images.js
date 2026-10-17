const { Client } = require('pg');
require('dotenv').config();
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function verify() {
  await client.connect();
  const total = await client.query('SELECT count(*) FROM saved_links;');
  const storageThumb = await client.query("SELECT count(*) FROM saved_links WHERE thumbnail_url LIKE '/storage/%';");
  const mediaCount = await client.query('SELECT count(*) FROM media_storage;');

  console.log('--- FINAL DATABASE VERIFICATION ---');
  console.log('Total Links in Neon:', total.rows[0].count);
  console.log('Links with permanent local/Neon storage path:', storageThumb.rows[0].count);
  console.log('Total media records in Neon media_storage:', mediaCount.rows[0].count);

  await client.end();
}
verify();
