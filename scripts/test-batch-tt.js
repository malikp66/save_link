const { Client } = require('pg');
require('dotenv').config();

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function testBatchTikTok() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows } = await client.query(`
    SELECT s.id, s.url, s.title
    FROM saved_links s
    JOIN media_storage m ON m.link_id = s.id AND m.media_type = 'thumbnail'
    WHERE m.content_type = 'image/svg+xml' AND s.platform = 'tiktok'
    LIMIT 15;
  `);

  console.log(`Testing ${rows.length} TikTok placeholder links...`);

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    console.log(`\n[${i + 1}/${rows.length}] ID: ${item.id} | URL: ${item.url}`);
    
    // First try TikWM directly
    let success = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(item.url), {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await res.json();
        if (data.code === 0 && data.data) {
          console.log(`  ✅ TikWM SUCCESS: author=@${data.data.author?.unique_id}, title="${data.data.title?.substring(0, 30)}", cover=${data.data.cover?.substring(0, 50)}...`);
          success = true;
          break;
        } else if (data.msg?.includes('limit')) {
          console.log(`  ⏳ Rate limit hit, waiting 2s...`);
          await sleep(2000);
        } else {
          console.log(`  ⚠️ TikWM direct failed: code=${data.code}, msg=${data.msg}`);
          break;
        }
      } catch (e) {
        console.log(`  ❌ TikWM fetch error: ${e.message}`);
      }
      await sleep(1500);
    }

    if (!success) {
      // Try resolving redirect first
      try {
        const red = await fetch(item.url, {
          redirect: 'manual',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const loc = red.headers.get('location');
        if (loc) {
          console.log(`  🔗 Resolved to: ${loc.substring(0, 60)}...`);
          await sleep(1200);
          const res2 = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(loc));
          const data2 = await res2.json();
          if (data2.code === 0 && data2.data) {
            console.log(`  ✅ TikWM (resolved) SUCCESS: author=@${data2.data.author?.unique_id}, cover=${data2.data.cover?.substring(0, 50)}...`);
            success = true;
          } else {
            console.log(`  ⚠️ TikWM resolved failed: code=${data2.code}, msg=${data2.msg}`);
          }
        }
      } catch (e) {
        console.log(`  ❌ Redirect error: ${e.message}`);
      }
    }

    await sleep(1500);
  }

  await client.end();
}

testBatchTikTok();
