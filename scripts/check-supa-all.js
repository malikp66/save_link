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

const supabase = createClient(url, key);

async function checkAll() {
  const { data: cats } = await supabase.from('categories').select('*');
  console.log('Categories in Supabase:');
  console.table(cats.map(c => ({ id: c.id, name: c.name, slug: c.slug })));

  const { count } = await supabase.from('saved_links').select('*', { count: 'exact', head: true });
  console.log('Total links in Supabase:', count);
}

checkAll();
