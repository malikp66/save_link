async function test() {
  const url = 'https://www.tiktok.com/@laaaaas/video/7667429246066855189';
  const uas = [
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Twitterbot/1.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  ];

  for (const ua of uas) {
    console.log(`\nTesting UA: ${ua.substring(0, 30)}...`);
    const res = await fetch(url, { headers: { 'User-Agent': ua } });
    console.log('Status:', res.status);
    const html = await res.text();
    const m = html.match(/<meta property="og:image" content="([^"]+)"/i);
    const titleM = html.match(/<meta property="og:description" content="([^"]+)"/i) || html.match(/<title>([^<]+)<\/title>/i);
    console.log('og:image:', m ? m[1].substring(0, 100) : 'none');
    console.log('title:', titleM ? titleM[1].substring(0, 80) : 'none');

    // Also check JSON-LD
    const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        console.log('JSON-LD thumbnail:', parsed.thumbnailUrl || parsed.image);
      } catch (e) {}
    }

    // Check universal data script __UNIVERSAL_DATA_FOR_REHYDRATION__
    const univMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/i);
    if (univMatch) {
      try {
        const univ = JSON.parse(univMatch[1]);
        const item = univ['__DEFAULT_SCOPE__']?.['webapp.video-detail']?.['itemInfo']?.['itemStruct'];
        if (item) {
          console.log('Found video cover in Rehydration:', item.video?.cover);
        }
      } catch (e) {}
    }
  }
}
test();
