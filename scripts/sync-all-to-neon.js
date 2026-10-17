const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const initialLinksPath = path.join(__dirname, '../src/lib/initialLinks.json');

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to Neon Database. Syncing all 303 links into Neon DB...');

  const allItems = JSON.parse(fs.readFileSync(initialLinksPath, 'utf8'));
  console.log(`Loaded ${allItems.length} links from initialLinks.json.`);

  const { rows: dbCats } = await client.query('SELECT id, slug, name FROM categories;');
  const validCatIds = new Set(dbCats.map(c => c.id));
  console.log(`Valid categories in Neon: ${Array.from(validCatIds).join(', ')}`);

  function resolveCategoryId(item) {
    const legacyMap = {
      'cat-1': 'cat-fashion',
      'cat-2': 'cat-beauty',
      'cat-3': 'cat-dance',
      'cat-4': 'cat-lifestyle',
    };
    if (legacyMap[item.category_id]) return legacyMap[item.category_id];
    if (validCatIds.has(item.category_id)) return item.category_id;

    const talentMap = {
      'Chindo': 'cat-chindo',
      'Lokal / Indo': 'cat-lokal',
      'Hijab / Muslimah': 'cat-hijab',
      'Fienshyt / Edgy': 'cat-fienshyt',
      'Bocil / Remaja': 'cat-bocil',
      'Dokter & Profesi': 'cat-dokter',
      'Cosplay & Anime': 'cat-cosplay',
      'Kampus & Mahasiswi': 'cat-kampus',
      'Penting (Prioritas)': 'cat-penting',
      'Fashion & OOTD': 'cat-fashion',
      'Beauty & Skincare': 'cat-beauty',
      'Dance & Trends': 'cat-dance',
      'Lifestyle & Vlog': 'cat-lifestyle',
    };
    return talentMap[item.talent_type] || 'cat-lokal';
  }

  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const now = item.created_at || new Date().toISOString();
    const finalCatId = resolveCategoryId(item);
    item.category_id = finalCatId;

    const res = await client.query(`
      INSERT INTO saved_links (
        id, platform, url, media_type, author_username, author_name,
        author_avatar_url, author_profile_url, title, thumbnail_url,
        embed_html, audio_title, audio_author, hashtags, views_count,
        likes_count, comments_count, shares_count, engagement_rate,
        rating, category_id, talent_type, tags, hook_type, outreach_status,
        contact_phone, contact_email, contact_notes, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      )
      ON CONFLICT (url) DO UPDATE SET
        title = EXCLUDED.title,
        thumbnail_url = EXCLUDED.thumbnail_url,
        author_avatar_url = EXCLUDED.author_avatar_url,
        category_id = EXCLUDED.category_id,
        talent_type = EXCLUDED.talent_type,
        hook_type = EXCLUDED.hook_type,
        tags = EXCLUDED.tags,
        views_count = EXCLUDED.views_count,
        likes_count = EXCLUDED.likes_count,
        comments_count = EXCLUDED.comments_count,
        shares_count = EXCLUDED.shares_count,
        engagement_rate = EXCLUDED.engagement_rate,
        updated_at = EXCLUDED.updated_at
      RETURNING xmax;
    `, [
      item.id,
      item.platform || 'tiktok',
      item.url,
      item.media_type || 'reel',
      item.author_username || '',
      item.author_name || item.author_username || '',
      item.author_avatar_url || '',
      item.author_profile_url || '',
      item.title || '',
      item.thumbnail_url || '',
      item.embed_html || null,
      item.audio_title || '',
      item.audio_author || '',
      Array.isArray(item.hashtags) ? item.hashtags : [],
      Number(item.views_count) || 0,
      Number(item.likes_count) || 0,
      Number(item.comments_count) || 0,
      Number(item.shares_count) || 0,
      parseFloat(item.engagement_rate) || 0,
      Number(item.rating) || 4,
      item.category_id || 'cat-lokal',
      item.talent_type || 'Lokal / Indo',
      Array.isArray(item.tags) ? item.tags : [],
      item.hook_type || 'Visual Aesthetics',
      item.outreach_status || 'saved',
      item.contact_phone || '',
      item.contact_email || '',
      item.contact_notes || '',
      now,
      item.updated_at || now,
    ]);

    if (res.rows[0].xmax === '0') {
      insertedCount++;
    } else {
      updatedCount++;
    }

    if ((i + 1) % 50 === 0 || i === allItems.length - 1) {
      console.log(`Progress: ${i + 1}/${allItems.length} links synced.`);
    }
  }

  const { rows: countRes } = await client.query('SELECT count(*) FROM saved_links;');
  console.log(`\nSync finished! Total links now in Neon Database: ${countRes[0].count}`);
  console.log(`Newly inserted: ${insertedCount}, Updated: ${updatedCount}`);

  await client.end();
}

main().catch(err => {
  console.error('Error in sync-all-to-neon:', err);
  process.exit(1);
});
