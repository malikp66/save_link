async function testIgEmbed() {
  const url = 'https://www.instagram.com/p/DcwU2oXExEY/embed/captioned/';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    
    // Look for username
    const userMatch = html.match(/class="UsernameText"[^>]*>([^<]+)/i) || 
                      html.match(/class="Avatar"[^>]*href="\/([^\/"]+)/i) ||
                      html.match(/instagram\.com\/([a-zA-Z0-9_.-]+)/i);
    console.log('Username match:', userMatch ? userMatch[1] : 'none');

    // Look for image src
    const imgMatches = html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i) ||
                       html.match(/<img[^>]+src="([^">]+)"/i);
    console.log('Image match:', imgMatches ? imgMatches[1].substring(0, 100) : 'none');

    // Look for caption
    const captionMatch = html.match(/class="Caption"[^>]*>([\s\S]*?)<\/div>/i);
    if (captionMatch) {
      console.log('Caption snippet:', captionMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 100));
    }
  } catch (e) {
    console.error(e);
  }
}
testIgEmbed();
