async function inspectEmbed() {
  const shortcode = 'DEvVzZ_S8vA';
  const res = await fetch(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  const html = await res.text();
  // Find all strings like "username", "caption", etc.
  console.log('Includes Username:', html.includes('Username'));
  console.log('Includes Caption:', html.includes('Caption'));
  
  // Find window.__additionalDataLoaded or script with JSON
  const matches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  console.log('Found script tags:', matches.length);
  for (let i = 0; i < matches.length; i++) {
    const s = matches[i][1];
    if (s.includes('shortcode') || s.includes('author') || s.includes('caption') || s.includes('display_url')) {
      console.log(`Script ${i} matches! Length:`, s.length, 'preview:', s.slice(0, 300));
    }
  }
}

inspectEmbed();
