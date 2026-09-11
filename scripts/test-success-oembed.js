async function inspectSuccess() {
  const finalUrl = 'https://www.tiktok.com/@helenoleoopii/video/7667509119712103688';
  const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl)}`);
  const data = await oembedRes.json();
  console.log('TikTok oEmbed full response:', JSON.stringify(data, null, 2));
}

inspectSuccess();
