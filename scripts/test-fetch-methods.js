async function test() {
  const tts = [
    'https://vt.tiktok.com/ZSqJygxCJ/',
    'https://vt.tiktok.com/ZSV4PjUWB/',
    'https://vt.tiktok.com/ZSVC4nMX8/'
  ];

  console.log('--- Testing TikToks ---');
  for (const url of tts) {
    console.log('\nTesting:', url);
    // Method 1: TikWM directly
    try {
      const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url));
      const d = await res.json();
      console.log('TikWM direct:', d.code, d.msg, d.data ? { cover: d.data.cover?.substring(0, 60), author: d.data.author?.unique_id } : null);
    } catch (e) {
      console.log('TikWM error:', e.message);
    }

    // Method 2: Resolve redirect first
    try {
      const red = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
      const loc = red.headers.get('location');
      console.log('Redirect location:', loc);
      if (loc) {
        const res2 = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(loc));
        const d2 = await res2.json();
        console.log('TikWM via resolved URL:', d2.code, d2.msg, d2.data ? { cover: d2.data.cover?.substring(0, 60) } : null);
      }
    } catch (e) {
      console.log('Redirect check error:', e.message);
    }
  }

  const igs = [
    'https://www.instagram.com/p/Dd-WPttEuh0/',
    'https://www.instagram.com/p/Deb9s2qlBlv/',
    'https://www.instagram.com/p/DcA5D9ukWe2/'
  ];

  console.log('\n--- Testing Instagrams ---');
  for (const url of igs) {
    console.log('\nTesting:', url);
    const m = url.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
    const code = m ? m[2] : '';
    
    // Test 1: embed
    try {
      const embedRes = await fetch(`https://www.instagram.com/p/${code}/embed/captioned/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      const html = await embedRes.text();
      const imgMatch = html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i) || html.match(/class="EmbeddedMediaImage"[\s\S]*?src="([^"]+)"/i);
      console.log('Embed image match:', imgMatch ? imgMatch[1].substring(0, 70) : 'none', 'HTML len:', html.length);
    } catch (e) {
      console.log('Embed error:', e.message);
    }

    // Test 2: media/?size=l
    try {
      const mediaRes = await fetch(`https://www.instagram.com/p/${code}/media/?size=l`, {
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      console.log('/media/?size=l status:', mediaRes.status, 'Location:', mediaRes.headers.get('location')?.substring(0, 70));
    } catch (e) {
      console.log('Media error:', e.message);
    }
  }
}

test();
