async function testIgCrawlers() {
  const code = 'Dd-WPttEuh0';
  const url = `https://www.instagram.com/p/${code}/`;

  const userAgents = [
    { name: 'Twitterbot', ua: 'Twitterbot/1.0' },
    { name: 'FacebookBot', ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' },
    { name: 'Googlebot', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
    { name: 'WhatsApp', ua: 'WhatsApp/2.21.12.21 A' },
    { name: 'TelegramBot', ua: 'TelegramBot (like TwitterBot)' },
    { name: 'DiscordBot', ua: 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)' }
  ];

  for (const bot of userAgents) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': bot.ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      });
      const html = await res.text();
      console.log(`\n[${bot.name}] Status: ${res.status}, Length: ${html.length}`);
      const ogImage = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                      html.match(/content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);
      const ogTitle = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i);
      console.log(`[${bot.name}] og:image:`, ogImage ? ogImage[1] : 'none');
      console.log(`[${bot.name}] og:title:`, ogTitle ? ogTitle[1] : 'none');
    } catch (e) {
      console.log(`[${bot.name}] error:`, e.message);
    }
  }
}

testIgCrawlers();
