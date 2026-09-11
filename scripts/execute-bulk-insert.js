const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '../.env');
const env = fs.readFileSync(envPath, 'utf8');

let url = '', key = '';
env.split('\n').forEach(l => {
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = l.split('=')[1].trim();
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = l.split('=')[1].trim();
});

const supabase = createClient(url, key);

// Read raw items
const rawList = JSON.parse(fs.readFileSync(path.join(__dirname, 'bulk-analyzed-raw.json'), 'utf8'));

// Fetch categories from Supabase
async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Error getting categories:', error);
    return [];
  }
  return data;
}

// Check existing saved links
async function getExistingUrls() {
  const { data, error } = await supabase.from('saved_links').select('url');
  if (error) {
    console.error('Error fetching existing urls:', error);
    return new Set();
  }
  return new Set(data.map(d => d.url.trim().toLowerCase()));
}

async function main() {
  const cats = await getCategories();
  const catMap = {};
  cats.forEach(c => {
    catMap[c.slug] = c.id;
  });
  console.log('Categories loaded:', Object.keys(catMap));

  const existingUrls = await getExistingUrls();
  console.log(`Found ${existingUrls.size} existing links in Supabase.`);

  // Define curated mappings for the 41 items
  const curatedMappings = [
    // 1
    {
      url: "https://vt.tiktok.com/ZSqfGB4RS/",
      cat: "chindo",
      talent: "Chindo",
      title: "Meyii (@mxandreacen) - mencentylll🥰🤏🏻 (Cute Vibe)",
      tags: ["chindo", "aesthetic", "cute", "tiktok-trend"],
      hook: "Cute & Cheerful",
      rating: 4,
    },
    // 2
    {
      url: "https://vt.tiktok.com/ZSqfpTmgB/",
      cat: "bocil-remaja",
      talent: "Bocil / Remaja",
      title: "LAYKEN (@forevlyyy) - Teen glow up photo dump (12-14 yo)",
      tags: ["remaja", "glowup", "photodump", "transformation"],
      hook: "Transformation / Glow Up",
      rating: 4,
    },
    // 3
    {
      url: "https://vt.tiktok.com/ZSqfpBBbf/",
      cat: "chindo",
      talent: "Chindo",
      title: "Clarffe (@clarrfe) - Aesthetic Chindo casual look",
      tags: ["chindo", "aesthetic", "casual", "creator"],
      hook: "Visual Aesthetics",
      rating: 4,
    },
    // 4
    {
      url: "https://vt.tiktok.com/ZSqfpenHN/",
      cat: "bocil-remaja",
      talent: "Bocil / Remaja",
      title: "cweline (@celinesupersecretacc) - Relatable teen humor & selfie",
      tags: ["remaja", "relatable", "humor", "genz"],
      hook: "Relatable POV",
      rating: 4,
    },
    // 5
    {
      url: "https://vt.tiktok.com/ZSqfgdJ5M/",
      cat: "fienshyt-edgy",
      talent: "Fienshyt / Edgy",
      title: "ran (@sushicachimi) - Alt / Fienshyt aesthetic mood",
      tags: ["edgy", "fienshyt", "aesthetic", "alt-look"],
      hook: "Mood / Aesthetic Vibe",
      rating: 4,
    },
    // 6
    {
      url: "https://vt.tiktok.com/ZSqfgYFx2/",
      cat: "beauty-skincare",
      talent: "Korean Look",
      title: "sawakochangg (@sawakochangg) - Love the hair (Korean style)",
      tags: ["beauty", "hair", "korean-look", "hairstyle"],
      hook: "Beauty & Hair Styling",
      rating: 5,
    },
    // 7
    {
      url: "https://vt.tiktok.com/ZSqfgFvt2/",
      cat: "fienshyt-edgy",
      talent: "Fienshyt / Edgy",
      title: "@313.113 - Edgy aesthetic mood video",
      tags: ["edgy", "fienshyt", "dark-aesthetic", "mood"],
      hook: "Edgy Visuals",
      rating: 4,
    },
    // 8
    {
      url: "https://vt.tiktok.com/ZSqfbEtwr/",
      cat: "lokal-indo",
      talent: "Lokal / Indo",
      title: "a (@aeelysh) - Aesthetic girl mood video",
      tags: ["lokal", "aesthetic", "mood", "vibe"],
      hook: "Visual Mood",
      rating: 4,
    },
    // 9
    {
      url: "https://vt.tiktok.com/ZSqfgkJAe/",
      cat: "dance-trends",
      talent: "Lokal / Indo",
      title: "@313.113 - Sound trend DJ Gedene Cintaku Luar Biasa",
      tags: ["dance-trends", "remix", "sound-trend", "viral"],
      hook: "Audio / Sound Trend",
      rating: 4,
    },
    // 10
    {
      url: "https://vt.tiktok.com/ZSqfgrGhh/",
      cat: "dance-trends",
      talent: "Lokal / Indo",
      title: "eline_alicia (@eline_alicia) - Blambangan ekspress sound trend",
      tags: ["dance-trends", "remix", "sound-trend", "lokal"],
      hook: "Audio / Trend",
      rating: 4,
    },
    // 11
    {
      url: "https://www.instagram.com/p/Dc8-vkxE9HI/?img_index=3&stkn=MXNmdWQ0NXE3ZnNsdg==",
      cat: "chindo",
      talent: "Chindo",
      title: "珉珠 (@babiimerr) - Aesthetic nerdy glass look & selfie carousel",
      tags: ["chindo", "aesthetic", "selfie", "ootd"],
      hook: "Aesthetic Carousel",
      rating: 4,
    },
    // 12
    {
      url: "https://www.instagram.com/p/DOD--QCEjWc/?img_index=3&stkn=MXBvdWltenVmc25xYQ==",
      cat: "fashion-ootd",
      talent: "Chindo",
      title: "Lee Huang (@shuzxie_) - Clean OOTD & chic fashion styling",
      tags: ["fashion", "ootd", "chindo", "chic-style"],
      hook: "Fashion Styling / OOTD",
      rating: 5,
    },
    // 13
    {
      url: "https://vt.tiktok.com/ZSqynKSBE/",
      cat: "dance-trends",
      talent: "Lokal / Indo",
      title: "@313.113 - Jedag Jedug remix dance vibe",
      tags: ["dance-trends", "remix", "jedag-jedug", "viral"],
      hook: "Audio Trend",
      rating: 4,
    },
    // 14
    {
      url: "https://www.instagram.com/p/DSw1qt2E3o8/?stkn=MWU4enFwZ3c0dnJpcQ==",
      cat: "lifestyle-vlog",
      talent: "Lokal / Indo",
      title: "Raissa (@raissadilaa) - Matcha reset & cafe lifestyle",
      tags: ["matcha", "cafe", "lifestyle", "aesthetic"],
      hook: "Aesthetic Lifestyle / Cafe",
      rating: 4,
    },
    // 15
    {
      url: "https://www.instagram.com/p/DdHjFJ_T3oy/?stkn=MWFmYWVycWZ3cmJxMQ==",
      cat: "hijab-muslimah",
      talent: "Hijab / Muslimah",
      title: "@rahyaazz - My Fav song :) Hijab aesthetic feed",
      tags: ["hijab", "muslimah", "aesthetic", "music-vibe"],
      hook: "Aesthetic Hijab Mood",
      rating: 4,
    },
    // 16
    {
      url: "https://www.instagram.com/p/DcsflKjlH_g/?stkn=dnQ5ZDlra2k3bzZ6",
      cat: "lokal-indo",
      talent: "Lokal / Indo",
      title: "Riska Cahaya Putri (@rskachyaprtii) - OOTD & daily portraits",
      tags: ["lokal", "ootd", "beauty", "daily-portrait"],
      hook: "Visual Portrait",
      rating: 4,
    },
    // 17
    {
      url: "https://www.instagram.com/p/DcYfxtNFPCb/?img_index=2&stkn=djdmd216am8zZDQx",
      cat: "hijab-muslimah",
      talent: "Hijab / Muslimah",
      title: "Najma Salsabila (@telcantik) - Mahasiswi Akuntansi Telkom Univ",
      tags: ["kampus-mahasiswi", "telkom", "hijab-muslimah", "talent"],
      hook: "Campus Spotlight / Mahasiswi",
      rating: 5,
    },
    // 18
    {
      url: "https://www.instagram.com/p/DcwtEB7k3SR/?stkn=MWoxOHN6OTF3azZrYw==",
      cat: "lifestyle-vlog",
      talent: "Korean Look",
      title: "정혜진 (@jxhyejin) - Osaka & Nagoya travel photodump",
      tags: ["travel", "japan", "vlog", "korean-look", "lifestyle"],
      hook: "Travel Photodump",
      rating: 5,
    },
    // 19
    {
      url: "https://vt.tiktok.com/ZSqDvVB5u/",
      cat: "chindo",
      talent: "Chindo",
      title: "gracie (@douyingly77) - Douyin style cute selfie trend",
      tags: ["douyin", "cute", "chindo", "aesthetic"],
      hook: "Douyin Aesthetic",
      rating: 4,
    },
    // 20
    {
      url: "https://www.instagram.com/p/DdDn1GmD6Yi/?img_index=4&stkn=dTE3eGZ5OTN0a3gz",
      cat: "fashion-ootd",
      talent: "Lokal / Indo",
      title: "Hanna (@hgojo_gf) - 'let me be the one ❀' OOTD & feed",
      tags: ["ootd", "aesthetic", "fashion", "lokal"],
      hook: "Aesthetic OOTD",
      rating: 4,
    },
    // 21
    {
      url: "https://www.instagram.com/p/DcZPcK1kwOD/?stkn=MXFqMHdmNmE3emdjYw==",
      cat: "fienshyt-edgy",
      talent: "Fienshyt / Edgy",
      title: "kllvv (@exlvv__) - Dark & moody edgy aesthetic reels",
      tags: ["edgy", "fienshyt", "reels", "mood"],
      hook: "Dark Aesthetic",
      rating: 4,
    },
    // 22
    {
      url: "https://www.instagram.com/p/DdD5wMPH-fY/?stkn=MTJwdWp6dm1uOHd2Nw==",
      cat: "fashion-ootd",
      talent: "Chindo",
      title: "c (@cciinholisa) - 🤍🖤 Monochrome minimalist OOTD",
      tags: ["monochrome", "ootd", "minimalist", "chindo"],
      hook: "Minimalist Style",
      rating: 5,
    },
    // 23
    {
      url: "https://www.instagram.com/p/Dc7q-A8Gg7X/?stkn=MXM1YjU1eHU2ZHdqMw==",
      cat: "lifestyle-vlog",
      talent: "Lokal / Indo",
      title: "sasal0avv_ (@elsarmd) - Mencintai diri sendiri 💐 Flower & self-love",
      tags: ["selflove", "flowers", "lifestyle", "aesthetic"],
      hook: "Self Love & Flowers",
      rating: 4,
    },
    // 24
    {
      url: "https://www.instagram.com/reel/DdDse21swPn/?stkn=MTRmcDE5M3g0Y2Z1ag==",
      cat: "hijab-muslimah",
      talent: "Hijab / Muslimah",
      title: "Riaa (@zyaa22_11) - Muslimah reels & aesthetic vibe",
      tags: ["hijab", "muslimah", "reels", "viral"],
      hook: "Reels / Video",
      rating: 4,
    },
    // 25
    {
      url: "https://www.instagram.com/p/DdEKBorH8ef/?stkn=MWtsODBvenpnbjdxZw==",
      cat: "bocil-remaja",
      talent: "Bocil / Remaja",
      title: "shin𖣂 (@shinbyyysa_) - 'Same energy' playful teen vibes",
      tags: ["remaja", "humor", "playful", "aesthetic"],
      hook: "Playful Vibes",
      rating: 4,
    },
    // 26
    {
      url: "https://vt.tiktok.com/ZSqARNGYF/",
      cat: "lokal-indo",
      talent: "Lokal / Indo",
      title: "zoey (@joyekjawa) - Creative lifestyle & aesthetic creator",
      tags: ["lokal", "lifestyle", "creator", "aesthetic"],
      hook: "Creator Showcase",
      rating: 4,
    },
    // 27
    {
      url: "https://vt.tiktok.com/ZSqARvAdL/",
      cat: "fienshyt-edgy",
      talent: "Fienshyt / Edgy",
      title: "🛹 (@jessivsmessi) - Streetwear & Skater aesthetic (1.2M views)",
      tags: ["streetwear", "skater", "edgy", "fienshyt", "viral"],
      hook: "Skate & Street Culture",
      rating: 5,
    },
    // 28
    {
      url: "https://vt.tiktok.com/ZSqSE7yGP/",
      cat: "fienshyt-edgy",
      talent: "Fienshyt / Edgy",
      title: "anton lee’s dog (@isdatnaomii) - #Penulis #Anonimus #Ao3 aesthetic",
      tags: ["ao3", "penulis", "edgy", "aesthetic", "alt"],
      hook: "Subculture / Writing",
      rating: 4,
    },
    // 29
    {
      url: "https://www.tiktok.com/@miwayaaa1?_r=1&_t=ZS-99aoHL93FiP",
      cat: "bocil-remaja",
      talent: "Bocil / Remaja",
      title: "moxhi (@miwayaaa1) - TikTok Creator Profile",
      tags: ["creator-profile", "genz", "remaja", "tiktok"],
      hook: "Creator Profile",
      rating: 4,
    },
    // 30
    {
      url: "https://vt.tiktok.com/ZSqSG82Rj/",
      cat: "lifestyle-vlog",
      talent: "Lokal / Indo",
      title: "vala (@vaallla) - Nothings gonna hurt u baby chill vibes",
      tags: ["chill", "aesthetic", "lifestyle", "mood"],
      hook: "Chill Vibe",
      rating: 4,
    },
    // 31
    {
      url: "https://vt.tiktok.com/ZSqSk4f4f/",
      cat: "bocil-remaja",
      talent: "Bocil / Remaja",
      title: "dyne.melia (@dyne.melia) - Viral teen photo dump (1.3M views)",
      tags: ["remaja", "viral", "photodump", "fyp"],
      hook: "Viral Photodump",
      rating: 5,
    },
    // 32
    {
      url: "https://vt.tiktok.com/ZSqBTk74U/",
      cat: "chindo",
      talent: "Chindo",
      title: "yukii (@tanmiyuki99) - Cute aesthetic Chindo vibes",
      tags: ["chindo", "cute", "aesthetic", "daily"],
      hook: "Cute & Aesthetic",
      rating: 4,
    },
    // 33
    {
      url: "https://vt.tiktok.com/ZSqBTUY1e/",
      cat: "dance-trends",
      talent: "Chindo",
      title: "nathalie (@leejy7415) - 'Kamu: Theo James' Ngga Dulu trend",
      tags: ["relatable", "chindo", "trend", "humor"],
      hook: "Sound / POV Trend",
      rating: 5,
    },
    // 34
    {
      url: "https://vt.tiktok.com/ZSqBbQaCC/",
      cat: "chindo",
      talent: "Chindo",
      title: "line (@cline3cin) - Aesthetic Chindo girl short video",
      tags: ["chindo", "aesthetic", "trend", "daily"],
      hook: "Visual Portrait",
      rating: 4,
    },
    // 35
    {
      url: "https://www.instagram.com/p/Dc6Je_0EwHm/?stkn=MWRsYXpmN2l2aTc5dw==",
      cat: "fashion-ootd",
      talent: "Lokal / Indo",
      title: "Vina (@vvinalistian) - Chic modern fashion & casual OOTD",
      tags: ["fashion", "ootd", "lokal", "styling"],
      hook: "Chic Fashion",
      rating: 4,
    },
    // 36
    {
      url: "https://www.instagram.com/p/Dao7Rdojs2t/?img_index=2",
      cat: "lifestyle-vlog",
      talent: "Chindo",
      title: "Lily Liew (@lilyl_e_) - ☀️🍋 Summer holiday & cafe aesthetics",
      tags: ["chindo", "summer", "travel", "lifestyle"],
      hook: "Holiday Photodump",
      rating: 5,
    },
    // 37
    {
      url: "https://www.instagram.com/reel/Dbanqx9N688/",
      cat: "dance-trends",
      talent: "Chindo",
      title: "张美华 (@samanthaxzcz) - Too good at goodbyes lipsync trend",
      tags: ["lipsync", "trend", "chindo", "reels"],
      hook: "Lipsync / Performance",
      rating: 4,
    },
    // 38
    {
      url: "https://www.instagram.com/reel/DbNRO3tRh-W/",
      cat: "bocil-remaja",
      talent: "Lokal / Indo",
      title: "Pica (@picacuangel) - Apeee lu humorous teen reel",
      tags: ["humor", "remaja", "reels", "relatable"],
      hook: "Humor / Relatable",
      rating: 4,
    },
    // 39
    {
      url: "https://www.instagram.com/reel/Dbd_b32oZ3Q/",
      cat: "fienshyt-edgy",
      talent: "Fienshyt / Edgy",
      title: "@xik_imi4u - #hi Alt / edgy aesthetic short video",
      tags: ["edgy", "fienshyt", "reels", "aesthetic"],
      hook: "Alt Visuals",
      rating: 4,
    },
    // 40
    {
      url: "https://www.instagram.com/p/DbGNUhKD6L-/?img_index=2",
      cat: "lokal-indo",
      talent: "Lokal / Indo",
      title: "kissaa (@klsaaprl) - 24/7 Daily aesthetic portrait",
      tags: ["lokal", "daily", "aesthetic", "portrait"],
      hook: "Daily Portrait",
      rating: 4,
    },
    // 41
    {
      url: "https://www.instagram.com/p/Da2pxVDjDJu/?img_index=4",
      cat: "beauty-skincare",
      talent: "Korean Look",
      title: "유림 (@yrui.rm) - Hair dye color styling before trip (31K likes)",
      tags: ["beauty", "haircolor", "korean-look", "styling"],
      hook: "Hair Coloring / Transformation",
      rating: 5,
    },
  ];

  // Match with rawList data
  const finalItems = [];

  for (const item of curatedMappings) {
    // Find matching raw item
    const raw = rawList.find(r => r.url === item.url || (r.cleanUrl && item.url.includes(r.cleanUrl))) || {};

    const platform = item.url.includes('tiktok.com') ? 'tiktok' : 'instagram';
    const isProfile = item.url.includes('/@') && !item.url.includes('/video/') && !item.url.includes('/photo/') && !item.url.includes('vt.tiktok');
    const media_type = isProfile ? 'profile' : (item.url.includes('/reel/') || item.url.includes('/reels/') ? 'reel' : (platform === 'tiktok' ? 'video' : 'post'));

    let author_username = raw.author_username || '';
    let author_name = raw.author_name || '';
    let author_avatar_url = raw.author_avatar_url || '';
    let thumbnail_url = raw.thumbnail_url || '';

    // Special edge handling for joyekjawa
    if (item.url.includes('ZSqARNGYF')) {
      author_username = 'joyekjawa';
      author_name = 'zoey';
      author_avatar_url = 'https://p16-common-sign.tiktokcdn.com/tos-alisg-avt-0068/06d78cfbdf97e7f45196a6832c980efd~tplv-tiktokx-cropcenter:720:720.jpeg';
      thumbnail_url = 'https://p16-common-sign.tiktokcdn.com/tos-alisg-avt-0068/06d78cfbdf97e7f45196a6832c980efd~tplv-tiktokx-cropcenter:720:720.jpeg';
    }

    // Special edge handling for miwayaaa1
    if (item.url.includes('miwayaaa1')) {
      author_username = 'miwayaaa1';
      author_name = 'moxhi';
      author_avatar_url = 'https://p16-common-sign.tiktokcdn.com/tos-alisg-avt-0068/319bdbd744ac44740aacede00a136a5d~tplv-tiktokx-cropcenter:720:720.jpeg';
      thumbnail_url = 'https://p16-common-sign.tiktokcdn.com/tos-alisg-avt-0068/319bdbd744ac44740aacede00a136a5d~tplv-tiktokx-cropcenter:720:720.jpeg';
    }

    // engagement
    const views = raw.views_count || 0;
    const likes = raw.likes_count || 0;
    const comments = raw.comments_count || 0;
    const shares = raw.shares_count || 0;
    let engagement_rate = 0;
    if (views > 0) {
      engagement_rate = Number((((likes + comments + shares) / views) * 100).toFixed(2));
    } else if (likes > 0) {
      engagement_rate = Number(((likes / 1000) * 1.5).toFixed(2));
    }

    const category_id = catMap[item.cat] || null;

    finalItems.push({
      platform,
      url: item.url,
      media_type,
      author_username,
      author_name: author_name || author_username,
      author_avatar_url,
      author_profile_url: platform === 'tiktok' ? `https://www.tiktok.com/@${author_username}` : `https://www.instagram.com/${author_username}/`,
      title: item.title,
      thumbnail_url,
      audio_title: raw.music_title || null,
      audio_author: null,
      hashtags: item.tags,
      views_count: views,
      likes_count: likes,
      comments_count: comments,
      shares_count: shares,
      engagement_rate,
      rating: item.rating,
      category_id,
      talent_type: item.talent,
      tags: item.tags,
      hook_type: item.hook,
      outreach_status: 'saved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // Filter out any duplicates if same URL already in DB
  const toInsert = finalItems.filter(item => {
    const isDup = existingUrls.has(item.url.trim().toLowerCase());
    if (isDup) {
      console.log(`Skipping duplicate URL already in DB: ${item.url}`);
    }
    return !isDup;
  });

  console.log(`\nReady to insert ${toInsert.length} new curated items into Supabase...`);

  if (toInsert.length > 0) {
    const { data, error } = await supabase.from('saved_links').insert(toInsert).select('id, title, author_username');
    if (error) {
      console.error('Error inserting into Supabase:', error);
    } else {
      console.log(`Successfully inserted ${data.length} items into Supabase!`);
    }
  }

  // Also sync with initialLinks.json and parsed-user-links.json
  const initialLinksPath = path.join(__dirname, '../src/lib/initialLinks.json');
  const existingInitial = JSON.parse(fs.readFileSync(initialLinksPath, 'utf8'));

  const existingLocalUrls = new Set(existingInitial.map(i => i.url.trim().toLowerCase()));
  const newLocalItems = finalItems.filter(i => !existingLocalUrls.has(i.url.trim().toLowerCase()));

  if (newLocalItems.length > 0) {
    console.log(`Adding ${newLocalItems.length} items to initialLinks.json...`);
    // assign random ids for local fallback
    newLocalItems.forEach((it, idx) => {
      it.id = `link-bulk-new-${Date.now()}-${idx}`;
    });
    const updatedAll = [...existingInitial, ...newLocalItems];
    fs.writeFileSync(initialLinksPath, JSON.stringify(updatedAll, null, 2));

    const parsedPath = path.join(__dirname, 'parsed-user-links.json');
    if (fs.existsSync(parsedPath)) {
      fs.writeFileSync(parsedPath, JSON.stringify(updatedAll, null, 2));
    }
    console.log(`Updated initialLinks.json! Total items now: ${updatedAll.length}`);
  }
}

main();
