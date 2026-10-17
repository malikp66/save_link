async function test() {
  const shortUrl = 'https://vt.tiktok.com/ZSqJUHKhA/';
  const res = await fetch(shortUrl, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0' } });
  const loc = res.headers.get('location');
  console.log('Location:', loc);

  const cleanLoc = loc ? loc.split('?')[0] : '';
  console.log('Clean loc:', cleanLoc);

  // Try TikWM with cleanLoc
  const t1 = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(cleanLoc));
  const j1 = await t1.json();
  console.log('TikWM cleanLoc:', j1.code, j1.msg, j1.data?.cover);

  // Try TikWM with raw loc
  const t2 = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(loc));
  const j2 = await t2.json();
  console.log('TikWM raw loc:', j2.code, j2.msg, j2.data?.cover);
}

test();
