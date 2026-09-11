async function inspect() {
  // Test vt.tiktok redirect
  try {
    const res = await fetch('https://vt.tiktok.com/ZSqARNGYF/', {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });
    console.log('Redirect status:', res.status, 'Location:', res.headers.get('location'));
    const loc = res.headers.get('location');
    if (loc) {
      const res2 = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(loc));
      const j2 = await res2.json();
      console.log('Tikwm via full loc:', j2);
    }
  } catch (e) {
    console.error('Err1:', e.message);
  }

  // Test profile miwayaaa1
  try {
    const res = await fetch('https://www.tiktok.com/@miwayaaa1', {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1',
      }
    });
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta property=["']og:description["'] content=["']([^"']+)["']/i);
    const imageMatch = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
    console.log('miwayaaa1 title:', titleMatch && titleMatch[1]);
    console.log('miwayaaa1 desc:', descMatch && descMatch[1]);
    console.log('miwayaaa1 image:', imageMatch && imageMatch[1]);
  } catch (e) {
    console.error('Err2:', e.message);
  }
}

inspect();
