const fs = require('fs');

async function searchPatterns() {
  const url = 'https://www.instagram.com/p/DcwU2oXExEY/embed/captioned/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });
  const html = await res.text();

  // Find occurrences of DcwU2oXExEY
  const idx = html.indexOf('DcwU2oXExEY');
  console.log('Shortcode index:', idx);
  if (idx !== -1) {
    console.log('Surrounding context:', html.substring(idx - 200, idx + 400));
  }

  // Find any cdninstagram or fbcdn urls
  const cdn = [...html.matchAll(/https:\/\/[^"'\\]*(?:cdninstagram|fbcdn)[^"'\\]*/gi)];
  console.log('CDN URLs found:', cdn.length);
  if (cdn.length > 0) {
    console.log('First CDN url:', cdn[0][0]);
  }
}

searchPatterns();
