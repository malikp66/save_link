const fs = require('fs');
const path = require('path');

const linksPath = path.join(__dirname, 'parsed-user-links.json');
const destPath = path.join(__dirname, '../src/lib/initialLinks.json');

const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

// High-aesthetic portrait photos to replace any remaining generic/motherboard images
const BEAUTIFUL_PORTRAITS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
];

let fixedTitles = 0;
let fixedMotherboards = 0;

for (let i = 0; i < links.length; i++) {
  const item = links[i];

  // 1. Fix any motherboard or circuit board images
  if (item.thumbnail_url && (item.thumbnail_url.includes('photo-1518770660439') || item.thumbnail_url.includes('motherboard'))) {
    item.thumbnail_url = BEAUTIFUL_PORTRAITS[i % BEAUTIFUL_PORTRAITS.length];
    fixedMotherboards++;
  }

  // 2. Fix robotic titles like "TikTok Video [ID: ZSqJDknJ3] - Kategori General"
  if (item.title && (item.title.includes('TikTok Video [ID:') || item.title.startsWith('Instagram Content ['))) {
    const categoryName = item.tags && item.tags.length > 0 ? item.tags[0] : 'Lifestyle & Visual';
    if (item.platform === 'tiktok') {
      item.title = `Tren Video TikTok @${item.author_username} - ${categoryName}`;
    } else {
      item.title = `Reel Aesthetic @${item.author_username} - ${categoryName}`;
    }
    fixedTitles++;
  }

  // 3. Ensure author_name is clean (no raw IDs or single @)
  if (!item.author_name || item.author_name === '@' || item.author_name.startsWith('creator_')) {
    item.author_name = item.author_username
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

console.log(`Polished: ${fixedMotherboards} motherboard images replaced, ${fixedTitles} robotic titles cleaned up!`);

fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
fs.writeFileSync(destPath, JSON.stringify(links, null, 2));
console.log('Saved to src/lib/initialLinks.json!');
