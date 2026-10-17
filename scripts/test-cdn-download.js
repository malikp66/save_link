async function testDownload() {
  // Test TikTok CDN image download
  const ttImg = 'https://p16-common-sign.tiktokcdn-us.com/tos-alisg-p-0037/o4ZIAO7qAiXyBfCffnQIDrLgC8eDQQKIEb7k7g~tplv-tiktokx-cropcenter-q:300:400:q70.jpeg?dr=8596&refresh_token=6314c44a&x-expires=1789218000&x-signature=m06XQo40rX4%2Bf2xU76J5d3E%2FAg8%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&s=AWEME_DETAIL&sc=cover&biz_tag=tt_video';
  
  try {
    const res = await fetch(ttImg, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Referer': 'https://www.tiktok.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    console.log('TT CDN download status:', res.status, 'Content-Type:', res.headers.get('content-type'), 'Len:', (await res.arrayBuffer()).byteLength);
  } catch (e) {
    console.log('TT CDN error:', e.message);
  }

  // Test IG CDN image download
  const igImg = 'https://scontent.cdninstagram.com/v/t51.82787-19/771727100_18348331678';
  try {
    const res2 = await fetch(igImg, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Referer': 'https://www.instagram.com/',
        'Accept': 'image/*,*/*'
      }
    });
    console.log('IG CDN download status:', res2.status, 'Content-Type:', res2.headers.get('content-type'), 'Len:', (await res2.arrayBuffer()).byteLength);
  } catch (e) {
    console.log('IG CDN error:', e.message);
  }
}

testDownload();
