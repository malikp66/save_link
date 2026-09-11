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

async function testCatUpdate() {
  const { data: links } = await supabase.from('saved_links').select('id, category_id').limit(1);
  const linkId = links[0].id;
  console.log('Testing with linkId:', linkId);

  // Try updating with 'cat-lokal'
  const res1 = await supabase.from('saved_links').update({ category_id: 'cat-lokal' }).eq('id', linkId);
  console.log('Update with cat-lokal:', res1.error?.message);

  // Try updating with 'kocok'
  const res2 = await supabase.from('saved_links').update({ category_id: 'kocok' }).eq('id', linkId);
  console.log('Update with kocok:', res2.error?.message);
}

testCatUpdate();
