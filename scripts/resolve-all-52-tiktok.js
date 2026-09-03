const fs = require('fs');
const path = require('path');

const linksPath = path.join(__dirname, 'parsed-user-links.json');
const destPath = path.join(__dirname, '../src/lib/initialLinks.json');

const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveTikwm(url) {
  try {
    const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });
    const json = await res.json();
    if (json.code === 0 && json.data) {
      return {
        title: json.data.title || null,
        authorName: json.data.author?.nickname || json.data.author?.unique_id,
        username: json.data.author?.unique_id || null,
        avatar: json.data.author?.avatar || null,
        cover: json.data.cover || (json.data.images && json.data.images[0]) || null,
        views: json.data.play_count || 0,
        likes: json.data.digg_count || 0,
        comments: json.data.comment_count || 0,
        shares: json.data.share_count || 0,
      };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function main() {
  console.log('Starting deep TikTok metadata and real photo enrichment via TikWM...');

  const targetItems = links.filter(
    (l) => l.platform === 'tiktok' && (!l.thumbnail_url || !l.thumbnail_url.includes('tiktokcdn') || l.title.includes('TikTok Video [ID:'))
  );

  console.log(`Found ${targetItems.length} TikTok items to resolve.`);

  let resolved = 0;
  for (let i = 0; i < targetItems.length; i++) {
    const item = targetItems[i];
    console.log(`[${i + 1}/${targetItems.length}] Resolving: ${item.url}`);

    const data = await resolveTikwm(item.url);
    if (data) {
      if (data.username) item.author_username = data.username;
      if (data.authorName) item.author_name = data.authorName;
      if (data.title && data.title.trim()) item.title = data.title;
      if (data.cover) item.thumbnail_url = data.cover;
      if (data.avatar) item.author_avatar_url = data.avatar;
      if (data.views > 0) item.views_count = data.views;
      if (data.likes > 0) item.likes_count = data.likes;
      if (data.comments > 0) item.comments_count = data.comments;
      if (data.shares > 0) item.shares_count = data.shares;
      if (item.views_count > 0) {
        item.engagement_rate = Number(
          (((item.likes_count + item.comments_count + item.shares_count) / item.views_count) * 100).toFixed(2)
        );
      }
      resolved++;
      console.log(` -> SUCCESS: @${item.author_username} ("${(item.title || '').substring(0, 30)}...")`);
    } else {
      console.log(` -> Skipped or no data`);
    }

    // Save progressively every 5 items
    if (i % 5 === 0 || i === targetItems.length - 1) {
      fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
      fs.writeFileSync(destPath, JSON.stringify(links, null, 2));
    }

    // TikWM 1 request / second rate limit
    await sleep(1100);
  }

  console.log(`\nCompleted! Successfully resolved ${resolved}/${targetItems.length} items with real titles and photos!`);
  fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
  fs.writeFileSync(destPath, JSON.stringify(links, null, 2));
}

main();
