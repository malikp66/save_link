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

async function test() {
  const { data: cats, error: cErr } = await supabase.from('categories').select('*');
  console.log('Categories count:', cats?.length, 'error:', cErr);
  if (cats) console.log('Sample categories:', cats.slice(0, 3).map(c => ({ id: c.id, name: c.name })));

  const { data: links, error: lErr } = await supabase.from('saved_links').select('*').limit(3);
  console.log('Links count:', links?.length, 'error:', lErr);
}

test();
