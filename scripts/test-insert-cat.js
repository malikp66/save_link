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

async function testInsert() {
  const cat = {
    name: 'kocok',
    slug: 'kocok',
    color: '#ec4899',
    icon: 'tag',
    is_system: false,
  };
  console.log('Inserting category:', cat);
  const { data, error } = await supabase.from('categories').insert([cat]).select().single();
  console.log('Result:', { data, error });
}

testInsert();
