const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const thumbDir = path.join(__dirname, '../public/storage/thumbnails');

function generateAestheticCardSvg(authorUsername, talentType, platform) {
  const isTiktok = platform === 'tiktok';
  const cleanUser = (authorUsername || 'creator').replace(/[^a-zA-Z0-9_.-]/g, '');
  const talent = talentType || 'Content Creator';

  const accentColor1 = isTiktok ? '#00f2fe' : '#ec4899';
  const accentColor2 = isTiktok ? '#fe0979' : '#8b5cf6';
  const platformName = isTiktok ? 'TIKTOK' : 'INSTAGRAM';

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f111a" />
      <stop offset="50%" stop-color="#141226" />
      <stop offset="100%" stop-color="#090a10" />
    </linearGradient>
    <radialGradient id="neonGlow1" cx="30%" cy="25%" r="50%">
      <stop offset="0%" stop-color="${accentColor1}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${accentColor1}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="neonGlow2" cx="80%" cy="75%" r="55%">
      <stop offset="0%" stop-color="${accentColor2}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${accentColor2}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.08)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)" />
    </linearGradient>
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor1}" />
      <stop offset="100%" stop-color="${accentColor2}" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="500" fill="url(#bgGrad)" />
  <rect width="400" height="500" fill="url(#neonGlow1)" />
  <rect width="400" height="500" fill="url(#neonGlow2)" />

  <!-- Subtle Grid Lines -->
  <line x1="0" y1="125" x2="400" y2="125" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  <line x1="0" y1="250" x2="400" y2="250" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  <line x1="0" y1="375" x2="400" y2="375" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  <line x1="100" y1="0" x2="100" y2="500" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  <line x1="200" y1="0" x2="200" y2="500" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  <line x1="300" y1="0" x2="300" y2="500" stroke="rgba(255,255,255,0.03)" stroke-width="1" />

  <!-- Glass Card Frame -->
  <rect x="30" y="40" width="340" height="420" rx="20" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" />

  <!-- Top Platform Badge -->
  <rect x="130" y="65" width="140" height="28" rx="14" fill="rgba(0, 0, 0, 0.4)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
  <text x="200" y="84" fill="${accentColor1}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" letter-spacing="2" text-anchor="middle">${platformName}</text>

  <!-- Glowing Icon Badge -->
  <circle cx="200" cy="180" r="46" fill="rgba(255, 255, 255, 0.04)" stroke="url(#btnGrad)" stroke-width="2" />
  <circle cx="200" cy="180" r="54" fill="none" stroke="${accentColor1}" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="4, 4" />

  <!-- Play / Video Symbol -->
  <polygon points="193,165 215,180 193,195" fill="url(#btnGrad)" />

  <!-- Creator Handle -->
  <text x="200" y="275" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" text-anchor="middle">@${cleanUser}</text>

  <!-- Niche / Category Pill -->
  <rect x="110" y="305" width="180" height="32" rx="16" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" />
  <text x="200" y="326" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" text-anchor="middle">✨ ${talent}</text>

  <!-- Footer Tag -->
  <text x="200" y="420" fill="rgba(255, 255, 255, 0.4)" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" letter-spacing="1" text-anchor="middle">PREVIEW KONTEN</text>
</svg>
`.trim();
}

async function main() {
  // Generate generic aesthetic placeholders
  const defaultSvg = generateAestheticCardSvg('creator', 'Talent Scout', 'tiktok');
  fs.writeFileSync(path.join(__dirname, '../public/storage/placeholder-card.svg'), defaultSvg);
  console.log('Saved public/storage/placeholder-card.svg');

  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to Neon Database. Finding and replacing all unsplash dummy images...');

  // Select all media_storage items with unsplash
  const { rows } = await client.query(`
    SELECT m.id, m.link_id, m.original_url, s.author_username, s.talent_type, s.platform
    FROM media_storage m
    JOIN saved_links s ON m.link_id = s.id
    WHERE m.original_url LIKE '%unsplash%';
  `);

  console.log(`Found ${rows.length} dummy Unsplash images to replace with aesthetic UI placeholders.`);

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    const svgContent = generateAestheticCardSvg(item.author_username, item.talent_type, item.platform);
    const svgBuffer = Buffer.from(svgContent, 'utf8');
    const base64Data = `data:image/svg+xml;base64,${svgBuffer.toString('base64')}`;

    // Overwrite the file on disk
    const filename = `${item.link_id}.jpg`;
    fs.writeFileSync(path.join(thumbDir, filename), svgBuffer);

    // Update Neon DB media_storage
    await client.query(`
      UPDATE media_storage
      SET 
        original_url = $1,
        content_type = 'image/svg+xml',
        image_base64 = $2,
        image_data = $3,
        file_size = $4
      WHERE id = $5;
    `, [
      '/storage/placeholder-card.svg',
      base64Data,
      svgBuffer,
      svgBuffer.length,
      item.id,
    ]);

    process.stdout.write(`\rProgress: ${i + 1}/${rows.length} aesthetic placeholders generated`);
  }

  console.log('\nAll dummy unsplash images replaced with beautiful customized UI placeholders!');
  await client.end();
}

main().catch(err => {
  console.error('Error generating aesthetic placeholders:', err);
  process.exit(1);
});
