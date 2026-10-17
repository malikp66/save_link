async function test() {
  const code = 'DSw1qt2E3o8';
  
  // Method 1: Instagram media direct endpoint
  try {
    const mediaUrl = `https://www.instagram.com/p/${code}/media/?size=l`;
    const res = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'manual'
    });
    console.log('/media/?size=l status:', res.status, 'Location:', res.headers.get('location')?.substring(0, 80));
    if (res.headers.get('location')) {
      const imgRes = await fetch(res.headers.get('location'));
      console.log('Followed location status:', imgRes.status);
    }
  } catch (e) {
    console.log('/media error:', e.message);
  }

  // Method 2: Embed page
  try {
    const embedUrl = `https://www.instagram.com/p/${code}/embed/captioned/`;
    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('/embed/ status:', res.status);
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i) 
                 || html.match(/img class="[^"]*"[^>]*src="([^"]+)"/i);
      console.log('Embed image match:', match ? match[1].substring(0, 100) : 'none');
      if (match) {
        const cleanImg = match[1].replace(/&amp;/g, '&');
        const imgRes = await fetch(cleanImg, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        console.log('Download embed img status:', imgRes.status, 'Content-Length:', imgRes.headers.get('content-length'));
      }
    }
  } catch (e) {
    console.log('/embed error:', e.message);
  }
}

test();
