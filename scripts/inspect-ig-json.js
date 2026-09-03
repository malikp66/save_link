const fs = require('fs');

async function inspectHtml() {
  const url = 'https://www.instagram.com/p/DcwU2oXExEY/embed/captioned/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  const html = await res.text();
  
  // Search for username
  const matches = [...html.matchAll(/"username":\s*"([^"]+)"/g)];
  console.log('Usernames found via json:', matches.map(m => m[1]));

  // Search for display_url or thumbnail_src
  const images = [...html.matchAll(/"display_url":\s*"([^"]+)"/g), ...html.matchAll(/"thumbnail_src":\s*"([^"]+)"/g)];
  console.log('Images found via json:', images.map(m => m[1].replace(/\\u0026/g, '&')).slice(0, 3));

  // Search for caption text
  const captions = [...html.matchAll(/"text":\s*"([^"]+)"/g)];
  console.log('Captions found via json:', captions.map(m => m[1]).slice(0, 3));
}

inspectHtml();
