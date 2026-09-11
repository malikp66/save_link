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

async function testUpdateLinkTags() {
  const { data: links } = await supabase.from('saved_links').select('*').limit(1);
  const link = links[0];
  console.log('Target link:', link.id, 'current tags:', link.tags);
  const { data, error } = await supabase.from('saved_links').update({ tags: ['kocok', 'enak'] }).eq('id', link.id).select().single();
  console.log('Update result:', { dataTags: data?.tags, error });
}

testUpdateLinkTags();
