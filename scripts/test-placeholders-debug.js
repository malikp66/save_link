async function test() {
  const links = [
    { type: 'ig', url: 'https://www.instagram.com/p/Dd-WPttEuh0/' },
    { type: 'ig', url: 'https://www.instagram.com/p/Deb9s2qlBlv/' },
    { type: 'tt', url: 'https://vt.tiktok.com/ZSbKVd1Rt/' },
  ];

  for (const l of links) {
    console.log('\n--- Testing:', l.url);
    if (l.type === 'ig') {
      const match = l.url.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
      const code = match ? match[2] : '';
      console.log('IG Code:', code);
      // Try /media/?size=l
      const res = await fetch(`https://www.instagram.com/p/${code}/media/?size=l`, { redirect: 'manual' });
      console.log('IG /media/?size=l status:', res.status, 'Location:', res.headers.get('location')?.substring(0, 70));

      // Try embed
      const embedRes = await fetch(`https://www.instagram.com/p/${code}/embed/captioned/`);
      const embedHtml = await embedRes.text();
      const m = embedHtml.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i);
      console.log('IG embed match:', m ? m[1].substring(0, 70) : 'none');
    } else {
      // TikTok
      const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(l.url));
      const json = await res.json();
      console.log('TikWM code:', json.code, 'msg:', json.msg);
      if (json.data) {
        console.log('Cover:', json.data.cover);
        console.log('Author:', json.data.author?.unique_id);
      }
    }
  }
}

test();
