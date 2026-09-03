async function testMultiple() {
  const profiles = [
    'https://www.instagram.com/nadnatmelinda/',
    'https://www.instagram.com/baotran.311/',
    'https://www.instagram.com/miremireyaa/',
  ];
  
  for (const url of profiles) {
    console.log('\n--- Testing:', url, '---');
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        },
        signal: AbortSignal.timeout(5000),
      });
      const html = await res.text();
      
      const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
      const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
      const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      
      console.log('Title:', titleMatch ? titleMatch[1] : 'NONE');
      console.log('Image:', imageMatch ? imageMatch[1].substring(0, 80) : 'NONE');
      
      if (descMatch) {
        const d = descMatch[1];
        const followersMatch = d.match(/([\d,.]+[KMkm]?)\s*Followers/i);
        const followingMatch = d.match(/([\d,.]+[KMkm]?)\s*Following/i);
        const postsMatch = d.match(/([\d,.]+)\s*Posts/i);
        console.log('Followers:', followersMatch ? followersMatch[1] : '-');
        console.log('Following:', followingMatch ? followingMatch[1] : '-');
        console.log('Posts:', postsMatch ? postsMatch[1] : '-');
        
        // Extract bio (everything after "Posts -" or after the stats summary)
        const bioMatch = d.match(/Posts\s*[-–]\s*(.*)/i);
        if (bioMatch) {
          const bio = bioMatch[1].replace(/See Instagram photos and videos from .+/, '').trim();
          console.log('Bio hint:', bio || '(standard text)');
        }
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}
testMultiple();
