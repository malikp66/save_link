const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '../.env');
const env = fs.readFileSync(envPath, 'utf8');

let url = '', key = '';
env.split('\n').forEach(l => {
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = l.split('=')[1].trim();
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = l.split('=')[1].trim();
});

if (!url || !key) {
  console.error('Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(url, key);
const links = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/initialLinks.json'), 'utf8'));

async function syncToSupabase() {
  console.log(`Starting sync of ${links.length} curated links to Supabase (${url})...`);

  // 1. Fetch real categories from Supabase to map slugs to UUIDs
  const { data: dbCategories, error: catErr } = await supabase.from('categories').select('*');
  if (catErr) {
    console.error('Error fetching categories:', catErr);
  }
  
  const categoryMap = {};
  if (dbCategories) {
    dbCategories.forEach(c => {
      categoryMap[c.slug] = c.id;
      categoryMap[`cat-${c.slug}`] = c.id;
      if (c.slug === 'fashion-ootd') categoryMap['cat-1'] = c.id;
      if (c.slug === 'beauty-skincare') categoryMap['cat-2'] = c.id;
      if (c.slug === 'dance-trends') categoryMap['cat-3'] = c.id;
      if (c.slug === 'lifestyle-vlog') categoryMap['cat-4'] = c.id;
    });
  }

  // First delete the 3 existing test rows so we have a clean full set of 176 links
  console.log('Clearing existing test rows in saved_links...');
  await supabase.from('saved_links').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Transform links to match Supabase schema
  const rows = links.map(item => {
    const row = { ...item };
    delete row.id; // Let Supabase generate a fresh UUID for each row

    // Map category_id to UUID
    if (row.category_id && categoryMap[row.category_id]) {
      row.category_id = categoryMap[row.category_id];
    } else {
      row.category_id = null;
    }

    return row;
  });

  console.log('Inserting 176 curated links in batches of 25...');
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 25) {
    const batch = rows.slice(i, i + 25);
    const { data, error } = await supabase.from('saved_links').insert(batch).select('id');
    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / 25) + 1}:`, error.message);
      break;
    } else {
      inserted += (data ? data.length : batch.length);
      console.log(` -> Inserted ${inserted}/${rows.length} links into Supabase`);
    }
  }

  console.log(`\nSync complete! Total ${inserted}/${rows.length} links successfully inserted into Supabase!`);
}

syncToSupabase();
