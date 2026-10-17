const fs = require('fs');

async function inspectIgEmbed() {
  const code = 'Dd-WPttEuh0';
  const url = `https://www.instagram.com/p/${code}/embed/captioned/`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/ig-embed-dump.html', html);
  console.log('Saved ig-embed-dump.html, length:', html.length);

  // Search for image URLs in html
  const imgMatches = [...html.matchAll(/https:\/\/[^"'\s\\]+cdninstagram\.com[^"'\s\\]+/gi)].map(m => m[0]);
  console.log('cdninstagram matches:', imgMatches.length);
  if (imgMatches.length > 0) {
    console.log('First 5 cdninstagram matches:');
    imgMatches.slice(0, 5).forEach(m => console.log(m.replace(/\\u0026/g, '&')));
  }

  const fbcdnMatches = [...html.matchAll(/https:\/\/[^"'\s\\]+fbcdn\.net[^"'\s\\]+/gi)].map(m => m[0]);
  console.log('fbcdn matches:', fbcdnMatches.length);
  if (fbcdnMatches.length > 0) {
    console.log('First 5 fbcdn matches:');
    fbcdnMatches.slice(0, 5).forEach(m => console.log(m.replace(/\\u0026/g, '&')));
  }

  // Look for any <img> tags
  const imgTags = [...html.matchAll(/<img[^>]+>/gi)].map(m => m[0]);
  console.log('img tags found:', imgTags.length);
  imgTags.forEach((t, i) => console.log(`Tag ${i}:`, t.substring(0, 150)));
}

inspectIgEmbed();
