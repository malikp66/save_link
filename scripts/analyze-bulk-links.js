const fs = require('fs');
const path = require('path');

const rawLinks = [
  "https://vt.tiktok.com/ZSqfGB4RS/",
  "https://vt.tiktok.com/ZSqfpTmgB/",
  "https://vt.tiktok.com/ZSqfpBBbf/",
  "https://vt.tiktok.com/ZSqfpenHN/",
  "https://vt.tiktok.com/ZSqfgdJ5M/",
  "https://vt.tiktok.com/ZSqfgYFx2/",
  "https://vt.tiktok.com/ZSqfgFvt2/",
  "https://vt.tiktok.com/ZSqfbEtwr/",
  "https://vt.tiktok.com/ZSqfgkJAe/",
  "https://vt.tiktok.com/ZSqfgrGhh/",
  "https://www.instagram.com/p/Dc8-vkxE9HI/?img_index=3&stkn=MXNmdWQ0NXE3ZnNsdg==",
  "https://www.instagram.com/p/DOD--QCEjWc/?img_index=3&stkn=MXBvdWltenVmc25xYQ==",
  "https://vt.tiktok.com/ZSqynKSBE/",
  "https://www.instagram.com/p/DSw1qt2E3o8/?stkn=MWU4enFwZ3c0dnJpcQ==",
  "https://www.instagram.com/p/DdHjFJ_T3oy/?stkn=MWFmYWVycWZ3cmJxMQ==",
  "https://www.instagram.com/p/DcsflKjlH_g/?stkn=dnQ5ZDlra2k3bzZ6",
  "https://www.instagram.com/p/DcYfxtNFPCb/?img_index=2&stkn=djdmd216am8zZDQx",
  "https://www.instagram.com/p/DcwtEB7k3SR/?stkn=MWoxOHN6OTF3azZrYw==",
  "https://vt.tiktok.com/ZSqDvVB5u/",
  "https://www.instagram.com/p/DdDn1GmD6Yi/?img_index=4&stkn=dTE3eGZ5OTN0a3gz",
  "https://www.instagram.com/p/DcZPcK1kwOD/?stkn=MXFqMHdmNmE3emdjYw==",
  "https://www.instagram.com/p/DdD5wMPH-fY/?stkn=MTJwdWp6dm1uOHd2Nw==",
  "https://www.instagram.com/p/Dc7q-A8Gg7X/?stkn=MXM1YjU1eHU2ZHdqMw==",
  "https://www.instagram.com/reel/DdDse21swPn/?stkn=MTRmcDE5M3g0Y2Z1ag==",
  "https://www.instagram.com/p/DdEKBorH8ef/?stkn=MWtsODBvenpnbjdxZw==",
  "https://vt.tiktok.com/ZSqARNGYF/",
  "https://vt.tiktok.com/ZSqARvAdL/",
  "https://vt.tiktok.com/ZSqSE7yGP/",
  "https://www.tiktok.com/@miwayaaa1?_r=1&_t=ZS-99aoHL93FiP",
  "https://vt.tiktok.com/ZSqSG82Rj/",
  "https://vt.tiktok.com/ZSqSk4f4f/",
  "https://vt.tiktok.com/ZSqBTk74U/",
  "https://vt.tiktok.com/ZSqBTUY1e/",
  "https://vt.tiktok.com/ZSqBbQaCC/",
  "https://www.instagram.com/p/Dc6Je_0EwHm/?stkn=MWRsYXpmN2l2aTc5dw==",
  "https://www.instagram.com/p/Dao7Rdojs2t/?img_index=2",
  "https://www.instagram.com/reel/Dbanqx9N688/",
  "https://www.instagram.com/reel/DbNRO3tRh-W/",
  "https://www.instagram.com/reel/Dbd_b32oZ3Q/",
  "https://www.instagram.com/p/DbGNUhKD6L-/?img_index=2",
  "https://www.instagram.com/p/Da2pxVDjDJu/?img_index=4"
];

// Deduplicate links
const uniqueLinks = Array.from(new Set(rawLinks.map(l => l.trim())));
console.log(`Total unique links to analyze: ${uniqueLinks.length}`);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

async function resolveTikTok(url) {
  try {
    const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json();
    if (json.code === 0 && json.data) {
      return {
        platform: 'tiktok',
        url,
        title: json.data.title || '',
        author_username: json.data.author?.unique_id || '',
        author_name: json.data.author?.nickname || json.data.author?.unique_id || '',
        author_avatar_url: json.data.author?.avatar || '',
        author_profile_url: `https://www.tiktok.com/@${json.data.author?.unique_id || ''}`,
        thumbnail_url: json.data.cover || (json.data.images && json.data.images[0]) || '',
        views_count: json.data.play_count || 0,
        likes_count: json.data.digg_count || 0,
        comments_count: json.data.comment_count || 0,
        shares_count: json.data.share_count || 0,
        music_title: json.data.music_info?.title || '',
      };
    }
  } catch (e) {
    // try oembed
  }

  // fallback to oembed
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const json = await res.json();
      return {
        platform: 'tiktok',
        url,
        title: json.title || '',
        author_username: json.author_unique_id || '',
        author_name: json.author_name || '',
        author_avatar_url: '',
        author_profile_url: json.author_url || '',
        thumbnail_url: json.thumbnail_url || '',
        views_count: 0,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
      };
    }
  } catch (e) {}

  return {
    platform: 'tiktok',
    url,
    title: '',
    author_username: '',
    author_name: '',
  };
}

async function resolveInstagram(url) {
  const cleanUrl = url.split('?')[0];
  const uas = [
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Twitterbot/1.0',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  ];

  for (const ua of uas) {
    try {
      const res = await fetch(cleanUrl, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const html = await res.text();
        const titleMatch = html.match(/<meta property=["']og:title["'] content=["']([^"']+)["']/i) || html.match(/<title>([^<]+)<\/title>/i);
        const descMatch = html.match(/<meta property=["']og:description["'] content=["']([^"']+)["']/i);
        const imageMatch = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);

        const ogTitle = titleMatch ? decodeHtml(titleMatch[1]) : '';
        const ogDesc = descMatch ? decodeHtml(descMatch[1]) : '';
        const ogImage = imageMatch ? decodeHtml(imageMatch[1]) : '';

        // Extract user & name & caption
        let author_username = '';
        let author_name = '';
        let title = '';

        const userMatch = ogDesc.match(/(?:-\s*|^)([a-zA-Z0-9._]+)\s*(?:on\s+[A-Za-z]+|\:)/i)
          || ogDesc.match(/from\s+([a-zA-Z0-9._]+)\s*\(@/i)
          || ogTitle.match(/\(@([a-zA-Z0-9._]+)\)/i);
        if (userMatch) author_username = userMatch[1];

        const nameMatch = ogTitle.match(/^(.+?)\s*(?:\(@[a-zA-Z0-9._]+\))?\s*on Instagram/i)
          || ogTitle.match(/^(.+?)\s*\(@/i);
        if (nameMatch) author_name = nameMatch[1].trim();

        const captionMatch = ogDesc.match(/:\s*["“]?([^"”]+)["”]?/);
        if (captionMatch && captionMatch[1]) {
          title = captionMatch[1].trim();
        } else if (ogDesc) {
          title = ogDesc;
        }

        return {
          platform: 'instagram',
          url,
          cleanUrl,
          author_username,
          author_name: author_name || author_username,
          author_profile_url: author_username ? `https://www.instagram.com/${author_username}/` : '',
          author_avatar_url: ogImage || '',
          thumbnail_url: ogImage || '',
          title: title || ogTitle || '',
          ogTitle,
          ogDesc,
        };
      }
    } catch (e) {}
  }

  return {
    platform: 'instagram',
    url,
    cleanUrl,
    title: '',
    author_username: '',
    author_name: '',
  };
}

async function run() {
  const results = [];
  for (let i = 0; i < uniqueLinks.length; i++) {
    const link = uniqueLinks[i];
    console.log(`[${i + 1}/${uniqueLinks.length}] Resolving ${link}...`);
    let data;
    if (link.includes('tiktok.com')) {
      data = await resolveTikTok(link);
      await sleep(1000);
    } else {
      data = await resolveInstagram(link);
      await sleep(500);
    }
    console.log(`  -> @${data.author_username || 'unknown'} | Title: ${(data.title || '').slice(0, 40)}...`);
    results.push(data);
  }

  const outPath = path.join(__dirname, 'bulk-analyzed-raw.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote raw analysis to ${outPath}`);
}

run();
