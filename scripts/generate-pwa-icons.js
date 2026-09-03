const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function createSvgIcon(size) {
  const radius = size * 0.22;
  const fontSize = size * 0.45;
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="#0f111e" />
  <rect x="${size * 0.08}" y="${size * 0.08}" width="${size * 0.84}" height="${size * 0.84}" rx="${radius * 0.8}" fill="url(#grad)" filter="url(#shadow)" />
  <text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="900" font-size="${fontSize}" letter-spacing="-1">TP</text>
</svg>
  `;
}

async function generate() {
  console.log('Generating PWA icons...');
  
  // 192x192
  const svg192 = Buffer.from(createSvgIcon(192));
  await sharp(svg192).png().toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('Generated icon-192.png');

  // 512x512
  const svg512 = Buffer.from(createSvgIcon(512));
  await sharp(svg512).png().toFile(path.join(iconsDir, 'icon-512.png'));
  console.log('Generated icon-512.png');
}

generate().catch(console.error);
