async function testFreshTt() {
  const url = 'https://vt.tiktok.com/ZSVbYSGMX/';
  const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url));
  const data = await res.json();
  console.log('TikWM code:', data.code);
  if (data.data?.cover) {
    console.log('Cover URL:', data.data.cover);
    const imgRes = await fetch(data.data.cover, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.tiktok.com/'
      }
    });
    console.log('Download cover status:', imgRes.status, 'Len:', (await imgRes.arrayBuffer()).byteLength);
  }
}

testFreshTt();
