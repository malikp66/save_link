const shortUrl = 'https://vt.tiktok.com/ZSqJygxCJ/';

async function testUnshortenAndOembed() {
  console.log('1. Fetching redirect for:', shortUrl);
  const headRes = await fetch(shortUrl, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    }
  });
  console.log('Final URL:', headRes.url);

  // Extract canonical URL (remove query params)
  const canonicalUrl = headRes.url.split('?')[0];
  console.log('Canonical URL:', canonicalUrl);

  const match = canonicalUrl.match(/@([^/]+)\/video\/(\d+)/);
  if (match) {
    console.log('Extracted username:', match[1], 'videoId:', match[2]);
  }

  // Now test oEmbed with canonical URL
  const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(canonicalUrl)}`;
  console.log('Fetching oembed:', oembedUrl);
  const oRes = await fetch(oembedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  console.log('oEmbed status:', oRes.status);
  if (oRes.ok) {
    const data = await oRes.json();
    console.log('oEmbed data:');
    console.log(' - Title:', data.title);
    console.log(' - Author:', data.author_name);
    console.log(' - Author URL:', data.author_url);
    console.log(' - Thumbnail URL:', data.thumbnail_url);
    console.log(' - Embed HTML length:', data.html?.length);
  } else {
    console.log('oEmbed failed:', await oRes.text());
  }
}

testUnshortenAndOembed();
