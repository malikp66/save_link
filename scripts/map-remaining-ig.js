const fs = require('fs');
const path = require('path');

const linksPath = path.join(__dirname, 'parsed-user-links.json');
const destPath = path.join(__dirname, '../src/lib/initialLinks.json');

const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

const SHORTCODE_TO_CREATOR = {
  'DZXSTQpPtZN': { username: 'katarina.celine', name: 'Katarina Celine', title: 'Editorial Chic Lookbook Video' },
  'DbLNJRVlNj2': { username: 'katarina.celine', name: 'Katarina Celine', title: 'Sunset Portrait & Golden Hour Reel' },
  'DYyW2-HgL6y': { username: 'nadnatmelinda', name: 'Nadnat Melinda', title: 'Glam Aesthetic Makeup Transformation' },
  'DZC8ikwRFyv': { username: 'nadnatmelinda', name: 'Nadnat Melinda', title: 'Soft Brown Eye Makeup Tutorial' },
  'DbLTOdvT2Zm': { username: 'keisya.vibe', name: 'Keisya Levronka Look', title: 'Daily Acoustic Vibe & OOTD Reel' },
  'DO5qGXDk4lz': { username: 'anyaanelia', name: 'Anya Anelia', title: 'Monochrome Streetwear Outfit Inspiration' },
  'DbVkcqLkr50': { username: 'nadhifa.look', name: 'Nadhifa Allya', title: 'Clean Girl Routine & Skincare Haul' },
  'Da19QVqER95': { username: 'nadhifa.look', name: 'Nadhifa Allya', title: 'Weekend Cafe Hopping in Senopati' },
  'DadvcqGz2wp': { username: 'likahbsy', name: 'Lika Habsyi', title: 'Casual Chic Coffee Run Reel' },
  'DZXTINFuu3z': { username: 'baotran.311', name: 'Bao Tran', title: 'Asian Soft Glam Beauty Tutorial' },
  'DZb3k9PpVoA': { username: 'baotran.311', name: 'Bao Tran', title: 'Night Routine & Silk Pajamas Haul' },
  'DaSsR6kmRDV': { username: 'miremireyaa', name: 'Mire Mireya', title: 'Aesthetic Golden Glow Makeup Look' },
  'DavOUx_zkhn': { username: 'miremireyaa', name: 'Mire Mireya', title: 'Summer Dress Styling & Try-On' },
  'DZe70m0z5uB': { username: 'allenadarmawann', name: 'Allena Darmawan', title: 'Luxury Minimalist Bag & OOTD Review' },
  'DapIkgnRuKm': { username: 'allenadarmawann', name: 'Allena Darmawan', title: 'Evening Dinner Look GRWM' },
  'DXMcdiWjvyL': { username: 'velynciaagatha', name: 'Velyncia Agatha', title: 'Trendy Y2K Hair & Outfit Styling' },
  'DaSp-ImxHj4': { username: 'elizabthwen', name: 'Elizabeth Wen', title: 'Classic Elegance Brand Collaboration' },
  'DYrfQrVJZ_T': { username: 'elizabthwen', name: 'Elizabeth Wen', title: 'Modern Kebaya & Batik Chic Reel' },
  'DYLtoKeoeqV': { username: 'realydonna', name: 'Realy Donna', title: 'Fienshyt Edgy Streetstyle Reel' },
  'DaKpAmWTWcW': { username: 'cssygbrl', name: 'Cassy Gabriel', title: 'Official Portfolio Shoot Behind the Scene' },
  'DZ4lD6HyeP4': { username: 'cssygbrl', name: 'Cassy Gabriel', title: 'Studio Model Lighting & Pose Inspiration' },
  'DY1fVAXxfHp': { username: 'keishakiinanti', name: 'Keisha Kinanti', title: 'Acoustic Singing Cover & Soft Vibe' },
  'DZSKg0qRMDt': { username: 'keishakiinanti', name: 'Keisha Kinanti', title: 'Studio Recording Session & Vocal Reel' },
};

let mappedCount = 0;

for (const item of links) {
  if (item.platform === 'instagram') {
    const codeMatch = item.url.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    const code = codeMatch ? codeMatch[1] : null;
    if (code && SHORTCODE_TO_CREATOR[code]) {
      const match = SHORTCODE_TO_CREATOR[code];
      item.author_username = match.username;
      item.author_name = match.name;
      item.author_profile_url = `https://www.instagram.com/${match.username}/`;
      item.title = match.title;
      item.author_avatar_url = `https://api.dicebear.com/7.x/personas/svg?seed=${match.username}`;
      mappedCount++;
    }
  }
}

console.log(`Successfully mapped ${mappedCount} Instagram content links to real creator profiles!`);

fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
fs.writeFileSync(destPath, JSON.stringify(links, null, 2));
console.log('Saved to src/lib/initialLinks.json!');
