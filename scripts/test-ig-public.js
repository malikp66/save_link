async function testIgPublic() {
  const shortcode = 'DEvVzZ_S8vA';
  // Let's test instagram embed graphql / json endpoints
  const endpoints = [
    `https://www.instagram.com/p/${shortcode}/embed/`,
    `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
    `https://graph.facebook.com/v12.0/instagram_oembed?url=https://www.instagram.com/p/${shortcode}/`,
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });
      console.log(ep, 'status:', res.status, 'len:', (await res.text()).length);
    } catch (e) {
      console.log(ep, 'err:', e.message);
    }
  }
}

testIgPublic();
