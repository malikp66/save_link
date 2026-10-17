async function testIgProfile() {
  const users = ['katarina.celine', 'intandesss1', 'allenadarmawann'];
  for (const u of users) {
    try {
      const res = await fetch(`https://www.instagram.com/${u}/`, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      const html = await res.text();
      const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
      console.log(`@${u}:`, {
        status: res.status,
        title: ogTitle ? ogTitle[1] : null,
        img: ogImg ? ogImg[1].substring(0, 70) : null
      });
    } catch (e) {
      console.log(`@${u} error:`, e.message);
    }
  }
}
testIgProfile();
