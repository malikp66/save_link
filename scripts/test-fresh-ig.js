async function testFreshIg() {
  const u = 'katarina.celine';
  const res = await fetch(`https://www.instagram.com/${u}/`, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  const html = await res.text();
  const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImg) {
    const fullUrl = ogImg[1].replace(/&amp;/g, '&');
    console.log('Full IG URL:', fullUrl);
    const imgRes = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Referer': 'https://www.instagram.com/'
      }
    });
    console.log('Download status:', imgRes.status, 'Len:', (await imgRes.arrayBuffer()).byteLength);
  }
}

testFreshIg();
