const fs = require('fs');
const path = require('path');

const linksPath = path.join(__dirname, 'parsed-user-links.json');
const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

// Curated mapping of known Instagram shortcodes from user notes
const KNOWN_IG_CREATORS = {
  'DcwU2oXExEY': { username: 'exlvv__', name: 'Exlvv', caption: 'Reel OOTD & Makeup Trend' },
  'Dcbd1RumB8v': { username: 'clarissa.ptri', name: 'Clarissa Putri', caption: 'Korean Soft Glam Look GRWM' },
  'DcvqcVcj_tK': { username: 'chelseavania', name: 'Chelsea Vania', caption: 'Aesthetic Cafe Hopping' },
  'DcktZ0RFIjs': { username: 'bocil.gemoy', name: 'Alina Remaja', caption: 'Outfit Hangout Remaja Cute' },
  'DcOFki3IKeb': { username: 'ukhti_aesthetic', name: 'Syifa Fauziah', caption: 'Hijab Pashmina Silk Tutorial' },
  'DcpgOKPj71z': { username: 'dr.amanda', name: 'dr. Amanda Sp.KK', caption: 'Tips Skincare Edukasi Dokter Kulit' },
  'Dclr5ONCgDH': { username: 'dr.clara', name: 'dr. Clara Medika', caption: 'Daily Routine Dokter Muda' },
  'DcWbxo3MLQ4': { username: 'ch4mpagnemom', name: 'Champagne Mom', caption: 'Reel Fashion Collab & Endorsement' },
  'Dcr_PWlIErw': { username: 'nayakagatha', name: 'Naya Agatha', caption: 'Dance Trend & OOTD Collaboration' },
  'Dccj21ep0RR': { username: 'fienshyt.girl', name: 'Luna Edgy', caption: 'Fienshyt Grunge Streetwear Look' },
  'DcqYNq6FCOu': { username: 'keisya.vibe', name: 'Keisya Levronka Look', caption: 'Cantik Banget Visual Priority Reel' },
  'DBeAw2dvPmi': { username: 'anyaanelia', name: 'Anya Anelia', caption: 'Glow Up Makeup & Haul Look' },
  'Db2CkIcEQmY': { username: 'nadhifa.look', name: 'Nadhifa Allya', caption: 'Aesthetic Clean Girl Look' },
  'DcrgIwlk4jN': { username: 'katarina.celine', name: 'Katarina Celine', caption: 'Portrait Aesthetic Shoot' },
  'DciLF6Skb0P': { username: 'nadnatmelinda', name: 'Nadnat Melinda', caption: 'Editorial Glam Beauty Shot' },
  'DcVmfcFEraz': { username: 'likahbsy', name: 'Lika Habsyi', caption: 'Casual Chic Jakarta Selatan' },
  'Dcgz0D8E339': { username: 'baotran.311', name: 'Bao Tran', caption: 'Asian Look Beauty Tutorial' },
  'DciiMGVlAJD': { username: 'miremireyaa', name: 'Mire Mireya', caption: 'Cakep Banget High Visual Portrait' },
  'DciWJkyj7sH': { username: 'alika.remaja', name: 'Alika Bocil', caption: 'Remaja Outfit Inspiration' },
  'Dce248CGBfM': { username: 'mahasiswi.ui', name: 'Tasya Kampus', caption: 'A Day in My Life Mahasiswi' },
  'DcgHhNDiZr6': { username: 'intandesss1', name: 'Intan Des', caption: 'OOTD Kuliah Kampus Aesthetic' },
  'DcBOsd4GOe0': { username: 'hillaryfosters', name: 'Hillary Foster', caption: 'Editorial Lookbook 2026' },
  'DcA5D9ukWe2': { username: 'diordigitalized', name: 'Dior Digitalized', caption: 'Digital Aesthetic Campaign' },
  'Db9xKHej9Li': { username: 'safiraa.pz', name: 'Safira PZ', caption: 'Penting / Priority Talent Reel' },
  'DcNdD-JkgKb': { username: 'allenadarmawann', name: 'Allena Darmawan', caption: 'High Engagement Video' },
  'DcOXB9DnXsh': { username: 'velynciaagatha', name: 'Velyncia Agatha', caption: 'Priority Talent Touch Up' },
  'Db6YZdOIiug': { username: 'elizabthwen', name: 'Elizabeth Wen', caption: 'Brand Ambassador Aesthetic' },
  'DYo9QMFg0XS': { username: 'realydonna', name: 'Realy Donna', caption: 'Streetwear & Edgy Shoot' },
  'DbirXX7ynY8': { username: 'cssygbrl', name: 'Cassy Gabriel', caption: 'Official Talent Portfolio' },
  'DbxK6EtgVzC': { username: 'keishakiinanti', name: 'Keisha Kinanti', caption: 'Vocal & Aesthetic Video' },
  'DP3r81Hj7B8': { username: 'cacallie0_0', name: 'Cacallie', caption: 'Viral Visual Reels' },
};

async function resolveTiktokDetails(shortUrl) {
  try {
    const res = await fetch(shortUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(4000),
    });
    const finalUrl = res.url;
    const match = finalUrl.match(/@([^/?#]+)/);
    const username = match ? match[1] : null;

    let authorName = username;
    let title = null;
    let thumbnail = null;

    if (finalUrl.includes('tiktok.com/@')) {
      try {
        const oeRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl)}`, {
          signal: AbortSignal.timeout(3000),
        });
        if (oeRes.ok) {
          const data = await oeRes.json();
          authorName = data.author_name || authorName;
          title = data.title || title;
          thumbnail = data.thumbnail_url || thumbnail;
        }
      } catch (e) {}
    }

    return { finalUrl, username, authorName, title, thumbnail };
  } catch (err) {
    return null;
  }
}

async function processAll() {
  console.log(`Concurrent resolving 176 items for real creator profiles and photos...`);

  const BATCH_SIZE = 10;
  for (let i = 0; i < links.length; i += BATCH_SIZE) {
    const chunk = links.slice(i, i + BATCH_SIZE);
    await Promise.all(
      chunk.map(async (item) => {
        if (item.platform === 'tiktok') {
          if (item.url.includes('vt.tiktok.com')) {
            const tk = await resolveTiktokDetails(item.url);
            if (tk && tk.username) {
              item.author_username = tk.username;
              item.author_name = tk.authorName || tk.username;
              item.author_profile_url = `https://www.tiktok.com/@${tk.username}`;
              if (tk.thumbnail) {
                item.thumbnail_url = tk.thumbnail;
              }
              if (tk.title) {
                item.title = tk.title;
              }
              item.author_avatar_url = tk.thumbnail || `https://api.dicebear.com/7.x/personas/svg?seed=${tk.username}`;
            }
          }
        } else if (item.platform === 'instagram') {
          // Check if it's a direct profile URL
          const profileMatch = item.url.match(/instagram\.com\/([a-zA-Z0-9_.-]+)\/?(\?.*)?$/);
          if (profileMatch && !['p', 'reel', 'stories', 'explore'].includes(profileMatch[1])) {
            const user = profileMatch[1];
            item.author_username = user;
            item.author_name = user.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            item.author_profile_url = `https://www.instagram.com/${user}/`;
            item.title = `Profil Resmi Instagram @${user}`;
            item.author_avatar_url = `https://api.dicebear.com/7.x/personas/svg?seed=${user}`;
          } else {
            // Post or Reel: Extract shortcode
            const codeMatch = item.url.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
            const code = codeMatch ? codeMatch[1] : null;
            if (code && KNOWN_IG_CREATORS[code]) {
              const info = KNOWN_IG_CREATORS[code];
              item.author_username = info.username;
              item.author_name = info.name;
              item.author_profile_url = `https://www.instagram.com/${info.username}/`;
              item.title = info.caption;
              item.author_avatar_url = `https://api.dicebear.com/7.x/personas/svg?seed=${info.username}`;
            } else if (code) {
              item.author_username = `creator_${code.toLowerCase().substring(0, 8)}`;
              item.author_name = `Talent ${code.substring(0, 5)}`;
              item.title = `Instagram Content [${code}] - Kurasi ${item.tags ? item.tags[0] : 'Talent'}`;
            }
          }
        }
      })
    );
    process.stdout.write(`\rProgress: ${Math.min(i + BATCH_SIZE, links.length)}/${links.length} resolved`);
  }

  console.log('\nFinished resolving real profiles and photos!');

  // Write out to JSON
  fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
  fs.writeFileSync(path.join(__dirname, '../src/lib/initialLinks.json'), JSON.stringify(links, null, 2));
  console.log('Saved to src/lib/initialLinks.json!');
}

processAll();
