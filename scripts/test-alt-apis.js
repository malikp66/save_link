async function testApis() {
  const testUrl = 'https://vt.tiktok.com/ZSqJUHKhA/';

  // 1. Lovetik
  try {
    const res = await fetch('https://lovetik.com/api/ajax/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0'
      },
      body: new URLSearchParams({ query: testUrl }).toString()
    });
    console.log('Lovetik status:', res.status);
    const json = await res.json();
    console.log('Lovetik result:', {
      cover: json.cover,
      author: json.author,
      desc: json.desc
    });
  } catch (e) {
    console.log('Lovetik error:', e.message);
  }

  // 2. Tikmate
  try {
    const res = await fetch('https://api.tikmate.app/api/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0'
      },
      body: new URLSearchParams({ url: testUrl }).toString()
    });
    console.log('Tikmate status:', res.status);
    const json = await res.json();
    console.log('Tikmate result:', json);
  } catch (e) {
    console.log('Tikmate error:', e.message);
  }

  // 3. Ttdown
  try {
    const res = await fetch('https://ttdown.org/req', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0'
      },
      body: new URLSearchParams({ url: testUrl }).toString()
    });
    console.log('Ttdown status:', res.status);
    const text = await res.text();
    console.log('Ttdown snippet:', text.slice(0, 200));
  } catch (e) {
    console.log('Ttdown error:', e.message);
  }
}

testApis();
