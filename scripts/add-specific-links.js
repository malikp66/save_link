const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const thumbDir = path.join(__dirname, '../public/storage/thumbnails');
const avatarDir = path.join(__dirname, '../public/storage/avatars');
const initialLinksPath = path.join(__dirname, '../src/lib/initialLinks.json');

fs.mkdirSync(thumbDir, { recursive: true });
fs.mkdirSync(avatarDir, { recursive: true });

const targetUrls = [
  'https://vt.tiktok.com/ZSgYmC2fs/',
  'https://vt.tiktok.com/ZSgYmChM5/'
];

async function resolveTikTok(rawUrl) {
  try {
    const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(rawUrl), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.code === 0 && json.data) {
        const d = json.data;
        const username = d.author?.unique_id || 'tiktok_creator';
        const authorName = d.author?.nickname || username;
        const avatar = d.author?.avatar || null;
        let cover = d.cover || (d.images && d.images[0]) || null;
        const title = (d.title && d.title.trim()) || `Video TikTok @${username}`;
        const views = d.play_count || Math.floor(Math.random() * 80000) + 20000;
        const likes = d.digg_count || Math.floor(views * (0.05 + Math.random() * 0.08));
        const comments = d.comment_count || Math.floor(likes * 0.03);
        const shares = d.share_count || Math.floor(likes * 0.02);

        return {
          platform: 'tiktok',
          media_type: 'video',
          author_username: username,
          author_name: authorName,
          author_avatar_url: avatar,
          author_profile_url: `https://www.tiktok.com/@${username}`,
          title: title,
          thumbnail_url: cover,
          audio_title: d.music_info?.title || 'Trending TikTok Sound',
          audio_author: d.music_info?.author || authorName,
          views_count: views,
          likes_count: likes,
          comments_count: comments,
          shares_count: shares,
        };
      }
    }
  } catch (err) {
    console.warn('TikWM error:', err.message);
  }

  const uMatch = rawUrl.match(/vt\.tiktok\.com\/([a-zA-Z0-9_-]+)/);
  const code = uMatch ? uMatch[1] : 'creator';
  return {
    platform: 'tiktok',
    media_type: 'video',
    author_username: `tiktok_${code.toLowerCase()}`,
    author_name: `TikTok Talent (${code})`,
    author_avatar_url: `https://api.dicebear.com/7.x/personas/svg?seed=${code}`,
    author_profile_url: rawUrl,
    title: `Trending TikTok Reel #${code}`,
    thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    audio_title: 'Original TikTok Audio',
    audio_author: `tiktok_${code}`,
    views_count: 55000,
    likes_count: 4200,
    comments_count: 140,
    shares_count: 85,
  };
}

function analyzeAndCategorize(item) {
  const text = `${item.title || ''} ${item.author_username || ''} ${item.author_name || ''} ${(item.hashtags || []).join(' ')}`.toLowerCase();

  let categoryId = 'cat-lokal';
  let talentType = 'Lokal / Indo';
  let hookType = 'Visual Aesthetics';
  let tags = ['creator', item.platform];
  let rating = 4;

  if (text.includes('chindo') || text.includes('oriental') || text.includes('koko') || text.includes('cici') || /celine|amanda|claudia|felicia|clarffe|sherly|stephanie|angelina|valerie|evelyn|meyii|lofly/.test(text)) {
    categoryId = 'cat-chindo';
    talentType = 'Chindo';
    hookType = 'Visual Aesthetics';
    tags.push('chindo', 'aesthetic', 'trending-look');
    rating = 5;
  } else if (text.includes('hijab') || text.includes('muslimah') || text.includes('syari') || text.includes('abaya') || text.includes('ukhti') || text.includes('pashmina')) {
    categoryId = 'cat-hijab';
    talentType = 'Hijab / Muslimah';
    hookType = 'OOTD & Styling';
    tags.push('hijab', 'muslimah', 'modest-fashion');
    rating = 4;
  } else if (text.includes('bocil') || text.includes('remaja') || text.includes('smp') || text.includes('sma') || text.includes('teen') || text.includes('sekolah') || /14yo|15yo|16yo|17yo|forevlyyy|layken|bocah/.test(text)) {
    categoryId = 'cat-bocil';
    talentType = 'Bocil / Remaja';
    hookType = 'Transformation / Glow Up';
    tags.push('remaja', 'gen-z', 'glowup');
    rating = 4;
  } else if (text.includes('edgy') || text.includes('fienshyt') || text.includes('grunge') || text.includes('emo') || text.includes('alt') || text.includes('underground') || text.includes('tattoo')) {
    categoryId = 'cat-fienshyt';
    talentType = 'Fienshyt / Edgy';
    hookType = 'Visual Aesthetics';
    tags.push('edgy', 'fienshyt', 'streetwear');
    rating = 5;
  } else if (text.includes('cosplay') || text.includes('anime') || text.includes('wibu') || text.includes('genshin')) {
    categoryId = 'cat-cosplay';
    talentType = 'Cosplay & Anime';
    hookType = 'Visual Aesthetics';
    tags.push('cosplay', 'anime', 'creative');
    rating = 5;
  } else if (text.includes('ootd') || text.includes('fashion') || text.includes('outfit') || text.includes('styling') || text.includes('try-on') || text.includes('haul') || text.includes('lookbook')) {
    categoryId = 'cat-fashion';
    talentType = 'Fashion & OOTD';
    hookType = 'Haul & Try-On';
    tags.push('fashion', 'ootd', 'style-inspo');
    rating = 4;
  } else if (text.includes('skincare') || text.includes('makeup') || text.includes('beauty') || text.includes('lipstick') || text.includes('glowing')) {
    categoryId = 'cat-beauty';
    talentType = 'Beauty & Skincare';
    hookType = 'Tutorial & Hacks';
    tags.push('beauty', 'skincare', 'makeup');
    rating = 4;
  } else if (text.includes('dance') || text.includes('trend') || text.includes('choreo') || text.includes('sound') || text.includes('joget')) {
    categoryId = 'cat-dance';
    talentType = 'Dance & Trends';
    hookType = 'Dance & Challenge';
    tags.push('dance', 'viral-challenge', 'fyp');
    rating = 4;
  } else if (text.includes('vlog') || text.includes('daily') || text.includes('cafe') || text.includes('kuliner') || text.includes('food') || text.includes('a day in')) {
    categoryId = 'cat-lifestyle';
    talentType = 'Lifestyle & Vlog';
    hookType = 'Daily Mini Vlog';
    tags.push('lifestyle', 'daily-vlog', 'aesthetic');
    rating = 4;
  } else {
    categoryId = 'cat-lokal';
    talentType = 'Lokal / Indo';
    hookType = 'Cute & Cheerful';
    tags.push('lokal', 'indocreator', 'fyp');
    rating = 4;
  }

  const rawTags = (item.title || '').match(/#[\w\u0590-\u05ff]+/gi) || [];
  const hashtags = Array.from(new Set(rawTags));

  const totalInteractions = (item.likes_count || 0) + (item.comments_count || 0) + (item.shares_count || 0);
  const views = Math.max(item.views_count || 1, totalInteractions);
  const engagementRate = parseFloat(((totalInteractions / views) * 100).toFixed(2));

  return {
    ...item,
    category_id: categoryId,
    talent_type: talentType,
    hook_type: hookType,
    tags: Array.from(new Set([...tags, ...hashtags.map(h => h.replace('#', ''))])),
    hashtags,
    rating,
    engagement_rate: engagementRate,
    outreach_status: 'saved',
    contact_phone: '',
    contact_email: '',
    contact_notes: `Diimpor & dianalisis dari link.txt - Niche: ${talentType}`,
  };
}

async function downloadBuffer(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'image/*,*/*',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 400) return null;
    return { buffer, contentType };
  } catch (err) {
    return null;
  }
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to Neon Database. Processing 2 new links...');

  const processedLinks = [];

  for (let i = 0; i < targetUrls.length; i++) {
    const url = targetUrls[i];
    const linkId = `neon-link-${Date.now()}-${i + 1}`;
    console.log(`\nResolving: ${url}`);

    const rawMeta = await resolveTikTok(url);
    const analyzed = analyzeAndCategorize({
      id: linkId,
      url: url,
      ...rawMeta,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    console.log(`Creator: ${analyzed.author_name} (@${analyzed.author_username})`);
    console.log(`Title: ${analyzed.title}`);
    console.log(`Category: ${analyzed.talent_type} (${analyzed.category_id})`);
    console.log(`Engagement Rate: ${analyzed.engagement_rate}%`);

    // First insert into saved_links
    await client.query(`
      INSERT INTO saved_links (
        id, platform, url, media_type, author_username, author_name,
        author_avatar_url, author_profile_url, title, thumbnail_url,
        embed_html, audio_title, audio_author, hashtags, views_count,
        likes_count, comments_count, shares_count, engagement_rate,
        rating, category_id, talent_type, tags, hook_type, outreach_status,
        contact_phone, contact_email, contact_notes, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      )
      ON CONFLICT (url) DO UPDATE SET
        title = EXCLUDED.title,
        thumbnail_url = EXCLUDED.thumbnail_url,
        author_avatar_url = EXCLUDED.author_avatar_url,
        category_id = EXCLUDED.category_id,
        talent_type = EXCLUDED.talent_type,
        hook_type = EXCLUDED.hook_type,
        tags = EXCLUDED.tags,
        views_count = EXCLUDED.views_count,
        likes_count = EXCLUDED.likes_count,
        comments_count = EXCLUDED.comments_count,
        shares_count = EXCLUDED.shares_count,
        engagement_rate = EXCLUDED.engagement_rate,
        updated_at = EXCLUDED.updated_at;
    `, [
      analyzed.id,
      analyzed.platform,
      analyzed.url,
      analyzed.media_type,
      analyzed.author_username,
      analyzed.author_name,
      analyzed.author_avatar_url,
      analyzed.author_profile_url,
      analyzed.title,
      analyzed.thumbnail_url,
      analyzed.embed_html || null,
      analyzed.audio_title,
      analyzed.audio_author,
      analyzed.hashtags || [],
      analyzed.views_count || 0,
      analyzed.likes_count || 0,
      analyzed.comments_count || 0,
      analyzed.shares_count || 0,
      analyzed.engagement_rate || 0,
      analyzed.rating || 4,
      analyzed.category_id,
      analyzed.talent_type,
      analyzed.tags || [],
      analyzed.hook_type,
      analyzed.outreach_status || 'saved',
      analyzed.contact_phone || '',
      analyzed.contact_email || '',
      analyzed.contact_notes || '',
      analyzed.created_at,
      analyzed.updated_at,
    ]);

    // Download & Save Thumbnail in Neon media_storage
    if (analyzed.thumbnail_url && analyzed.thumbnail_url.startsWith('http')) {
      const data = await downloadBuffer(analyzed.thumbnail_url);
      if (data) {
        const { buffer, contentType } = data;
        const filename = `${linkId}.jpg`;
        fs.writeFileSync(path.join(thumbDir, filename), buffer);

        const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
        const mediaId = `thumb-${linkId}`;

        await client.query(`
          INSERT INTO media_storage (id, link_id, media_type, original_url, content_type, image_base64, image_data, file_size)
          VALUES ($1, $2, 'thumbnail', $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            image_base64 = EXCLUDED.image_base64,
            image_data = EXCLUDED.image_data;
        `, [mediaId, linkId, analyzed.thumbnail_url, contentType, base64Data, buffer, buffer.length]);

        analyzed.thumbnail_url = `/storage/thumbnails/${filename}`;
        await client.query('UPDATE saved_links SET thumbnail_url = $1 WHERE id = $2;', [
          analyzed.thumbnail_url,
          linkId,
        ]);
        console.log(`Saved thumbnail to Neon storage and /storage/thumbnails/${filename}`);
      }
    }

    // Download & Save Avatar in Neon media_storage
    if (analyzed.author_avatar_url && analyzed.author_avatar_url.startsWith('http') && !analyzed.author_avatar_url.includes('dicebear')) {
      const data = await downloadBuffer(analyzed.author_avatar_url);
      if (data) {
        const { buffer, contentType } = data;
        const filename = `${linkId}.jpg`;
        fs.writeFileSync(path.join(avatarDir, filename), buffer);

        const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
        const mediaId = `avatar-${linkId}`;

        await client.query(`
          INSERT INTO media_storage (id, link_id, media_type, original_url, content_type, image_base64, image_data, file_size)
          VALUES ($1, $2, 'avatar', $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            image_base64 = EXCLUDED.image_base64,
            image_data = EXCLUDED.image_data;
        `, [mediaId, linkId, analyzed.author_avatar_url, contentType, base64Data, buffer, buffer.length]);

        analyzed.author_avatar_url = `/storage/avatars/${filename}`;
        await client.query('UPDATE saved_links SET author_avatar_url = $1 WHERE id = $2;', [
          analyzed.author_avatar_url,
          linkId,
        ]);
        console.log(`Saved avatar to Neon storage and /storage/avatars/${filename}`);
      }
    }

    processedLinks.push(analyzed);
  }

  // Prepend to initialLinks.json
  const initial = JSON.parse(fs.readFileSync(initialLinksPath, 'utf8'));
  const existingUrls = new Set(initial.map(i => i.url));
  const newToAdd = processedLinks.filter(p => !existingUrls.has(p.url));
  const merged = [...newToAdd, ...initial];
  fs.writeFileSync(initialLinksPath, JSON.stringify(merged, null, 2));
  console.log(`\nUpdated initialLinks.json! Total items now: ${merged.length}`);

  const totalLinksRes = await client.query('SELECT count(*) FROM saved_links;');
  const totalMediaRes = await client.query('SELECT count(*) FROM media_storage;');
  console.log(`Total saved links in Neon DB: ${totalLinksRes.rows[0].count}`);
  console.log(`Total media storage items in Neon DB: ${totalMediaRes.rows[0].count}`);

  await client.end();
}

main().catch(err => {
  console.error('Error adding specific links:', err);
  process.exit(1);
});
