async function testIgEndpoints() {
  const url = 'https://www.instagram.com/reel/DEvVzZ_S8vA/';
  const shortcode = 'DEvVzZ_S8vA';

  // 1. Instagram official oEmbed
  try {
    const res = await fetch(`https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`);
    console.log('IG api.instagram.com/oembed status:', res.status);
    const text = await res.text();
    console.log('IG oEmbed text:', text.slice(0, 300));
  } catch (e) {
    console.log('IG oembed err:', e.message);
  }

  // 2. Query param __a=1 or __d=dis
  try {
    const res = await fetch(`https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      }
    });
    console.log('IG __a=1 status:', res.status);
  } catch (e) {
    console.log('IG __a=1 err:', e.message);
  }

  // 3. Instagram embed iframe or embed JS
  console.log('Embed code for IG:');
  console.log(`<blockquote class="instagram-media" data-instgrm-permalink="${url}"></blockquote>`);
}

testIgEndpoints();
