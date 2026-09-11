const fs = require('fs');
const links = JSON.parse(fs.readFileSync('src/lib/initialLinks.json', 'utf8'));

async function testMultiple() {
  const tiktokLinks = links.filter(l => l.platform === 'tiktok').slice(0, 5);
  for (const l of tiktokLinks) {
    console.log('Testing link:', l.url, 'author:', l.author_username);
    try {
      const res = await fetch(l.url, { redirect: 'follow' });
      const finalUrl = res.url.split('?')[0];
      console.log(' -> Final URL:', finalUrl);
      const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl)}`);
      console.log(' -> oEmbed status:', oembedRes.status);
      if (oembedRes.ok) {
        const d = await oembedRes.json();
        console.log('    SUCCESS! title:', d.title);
        break;
      }
    } catch (e) {
      console.log(' -> Error:', e.message);
    }
  }
}

testMultiple();
