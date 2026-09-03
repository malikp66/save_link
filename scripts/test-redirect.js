async function test() {
  const shortUrl = 'https://vt.tiktok.com/ZSqJygxCJ/';
  try {
    const res = await fetch(shortUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
    });
    console.log('Final URL:', res.url);
    const m = res.url.match(/@([^/?#]+)/);
    if (m) console.log('Author from redirect URL:', m[1]);
  } catch (err) {
    console.error(err);
  }
}
test();
