async function test() {
  const url = 'https://www.tiktok.com/@laaaaas/video/7667429246066855189';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Len:', html.length);
  const title = html.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:', title ? title[1] : 'none');
  const ogImg = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i);
  console.log('OG Img:', ogImg ? ogImg[1] : 'none');

  const sigiMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/i) ||
                    html.match(/<script id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/i);
  console.log('Universal data found:', !!sigiMatch);
  if (sigiMatch) {
    try {
      const data = JSON.parse(sigiMatch[1]);
      const item = data.__DEFAULT_SCOPE__?.['webapp.video-detail']?.itemInfo?.itemStruct;
      console.log('Video struct:', {
        cover: item?.video?.cover,
        originCover: item?.video?.originCover,
        dynamicCover: item?.video?.dynamicCover,
        author: item?.author?.uniqueId
      });
    } catch (e) {
      console.log('JSON parse err:', e.message);
    }
  }
}

test();
