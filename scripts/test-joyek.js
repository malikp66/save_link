async function testJoyek() {
  const urlVideo = 'https://www.tiktok.com/@joyekjawa/video/7683159566804176146';
  const res1 = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(urlVideo));
  console.log('Tikwm video:', await res1.json());

  const res2 = await fetch('https://www.tiktok.com/@joyekjawa/photo/7683159566804176146', {
    headers: { 'User-Agent': 'facebookexternalhit/1.1' }
  });
  const html = await res2.text();
  console.log('OG title:', html.match(/<meta property=["']og:title["'] content=["']([^"']+)["']/i)?.[1]);
  console.log('OG desc:', html.match(/<meta property=["']og:description["'] content=["']([^"']+)["']/i)?.[1]);
  console.log('OG img:', html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i)?.[1]);
  try {
    const r = await fetch('https://www.tiktok.com/@joyekjawa', { headers: { 'User-Agent': 'facebookexternalhit/1.1' } });
    const text = await r.text();
    console.log('Profile Title:', text.match(/<title>([^<]+)<\/title>/i)?.[1]);
    console.log('Profile Desc:', text.match(/<meta property=["']og:description["'] content=["']([^"']+)["']/i)?.[1]);
    console.log('Profile Image:', text.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i)?.[1]);
  } catch(e) {
    console.error(e);
  }
}
testJoyek();
