async function testHeaders() {
  const url = 'https://scontent.cdninstagram.com/v/t51.82787-15/607424130_18419783905143147_8968469581264943693_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=vJ0ampjy15oQ7kNvwEPpFrO&_nc_oc=AdrL4fj5qCqe7366QmrvTjvPVtNl3QmHubQIhOJTPzYIwUdSYiKKx-inzMjh7GC3PUs&_nc_zt=23&_nc_ht=scontent-sin11-2.cdninstagram.com&_nc_gid=eXzwHYH8HnvnuRbM2D90zA&_nc_ss=7f689&oh=00_AQLViFUn9MpN7gPjWwORRttBRm0zCzxmlt_-7MR4WoNsPQ&oe=6AA9B8FE';

  const configs = [
    { name: 'No referer, standard Chrome', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } },
    { name: 'FB externalhit UA', headers: { 'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' } },
    { name: 'Android IG App UA', headers: { 'User-Agent': 'Instagram 278.0.0.19.115 Android' } },
    { name: 'Googlebot UA', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } },
    { name: 'Fetch clean without query', urlClean: url.split('?')[0] },
  ];

  for (const c of configs) {
    try {
      const res = await fetch(c.urlClean || url, { headers: c.headers || {} });
      console.log(`${c.name}: ${res.status}`);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        console.log(` -> Success! Buffer size: ${buf.byteLength}`);
      }
    } catch (e) {
      console.log(`${c.name} error: ${e.message}`);
    }
  }
}
testHeaders();
