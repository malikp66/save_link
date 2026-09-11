async function inspectScript10() {
  const shortcode = 'DEvVzZ_S8vA';
  const res = await fetch(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  const html = await res.text();
  const matches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  const s = matches[10]?.[1] || '';
  // Search for display_url or shortcode or author or owner
  const words = ['shortcode', 'owner', 'username', 'display_url', 'edge_media_to_caption', 'caption', 'edge_liked_by'];
  for (const w of words) {
    const idx = s.indexOf(w);
    console.log(`Word "${w}": found at ${idx}`);
    if (idx !== -1) {
      console.log(`  Snippet:`, s.slice(Math.max(0, idx - 40), idx + 100));
    }
  }
}

inspectScript10();
