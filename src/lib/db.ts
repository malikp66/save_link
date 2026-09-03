import { Category, SavedLink, OutreachStatus } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Fashion & OOTD', slug: 'fashion-ootd', color: '#ec4899', icon: 'shirt', is_system: true },
  { id: 'cat-2', name: 'Beauty & Skincare', slug: 'beauty-skincare', color: '#f43f5e', icon: 'sparkles', is_system: true },
  { id: 'cat-3', name: 'Dance & Trends', slug: 'dance-trends', color: '#a855f7', icon: 'music', is_system: true },
  { id: 'cat-4', name: 'Lifestyle & Vlog', slug: 'lifestyle-vlog', color: '#06b6d4', icon: 'camera', is_system: true },
  { id: 'cat-5', name: 'Fitness & Health', slug: 'fitness-health', color: '#10b981', icon: 'activity', is_system: true },
  { id: 'cat-6', name: 'Cosplay & Aesthetic', slug: 'cosplay-aesthetic', color: '#8b5cf6', icon: 'palette', is_system: true },
  { id: 'cat-7', name: 'Comedy & POV', slug: 'comedy-pov', color: '#f59e0b', icon: 'smile', is_system: true },
];

const INITIAL_LINKS: SavedLink[] = [
  {
    id: 'link-1',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/C3x9a1BpQqR/',
    media_type: 'reel',
    author_username: 'clarissaputri_',
    author_name: 'Clarissa Putri',
    author_avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_profile_url: 'https://www.instagram.com/clarissaputri_/',
    title: 'Korean Soft Glam Makeup Tutorial 💄✨ GRWM edisi dinner bareng bestie! Cocok buat beginner.',
    thumbnail_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    audio_title: 'Sabrina Carpenter - Espresso (Slowed + Reverb)',
    audio_author: 'sabrinacarpenter',
    hashtags: ['#makeuptutorial', '#koreanmakeup', '#grwm', '#beautyvlogger', '#skincareroutine'],
    views_count: 342000,
    likes_count: 28400,
    comments_count: 852,
    shares_count: 1420,
    engagement_rate: 8.97,
    rating: 5,
    category_id: 'cat-2',
    tags: ['Skincare', 'Tutorial', 'High Engagement', 'Priority Talent'],
    hook_type: 'GRWM',
    outreach_status: 'shortlisted',
    contact_phone: '+6281234567890',
    contact_email: 'mgmt.clarissa@gmail.com',
    contact_notes: 'Visual estetik, tone suara soft & engaging. Sangat cocok untuk campaign launching skincare Q3.',
    last_contacted_at: null,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'link-2',
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@nadya_arista/video/7345678901234567890',
    media_type: 'video',
    author_username: 'nadya_arista',
    author_name: 'Nadya Arista',
    author_avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    author_profile_url: 'https://www.tiktok.com/@nadya_arista',
    title: 'Haul & Try On Baju Edisi Monochrome Minimalist! Spill link di bio no 24 👗🤍',
    thumbnail_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    audio_title: 'Original Sound - Nadya Aesthetic Beats',
    audio_author: 'nadya_arista',
    hashtags: ['#ootdindo', '#haulbaju', '#minimalistfashion', '#outfitideas', '#tryonhaul'],
    views_count: 890000,
    likes_count: 94000,
    comments_count: 1820,
    shares_count: 5400,
    engagement_rate: 11.37,
    rating: 5,
    category_id: 'cat-1',
    tags: ['Fashion', 'OOTD Try On', 'Monochrome', 'Viral Sound'],
    hook_type: 'Haul & Try-On',
    outreach_status: 'contacted',
    contact_phone: '+6281987654321',
    contact_email: 'collab.nadya@agency.co.id',
    contact_notes: 'Sudah di-DM per 2 September. Menunggu rate card untuk endorsement fashion line.',
    last_contacted_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'link-3',
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@chelsea_dance/video/7345987654321123456',
    media_type: 'video',
    author_username: 'chelsea_dance',
    author_name: 'Chelsea Vania',
    author_avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    author_profile_url: 'https://www.tiktok.com/@chelsea_dance',
    title: 'Trend dance baru ini nagih bgt siapa yg udah coba dc ini? 💃🔥 #dancecover',
    thumbnail_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80',
    audio_title: 'Magnetic - ILLIT (Speed Up Remix)',
    audio_author: 'kpop_remix',
    hashtags: ['#dancecover', '#kpopdance', '#trendingdance', '#tiktokviral', '#magnetic'],
    views_count: 1250000,
    likes_count: 142000,
    comments_count: 2400,
    shares_count: 8900,
    engagement_rate: 12.26,
    rating: 4,
    category_id: 'cat-3',
    tags: ['Dance', 'Kpop', 'Trending Audio'],
    hook_type: 'Dance / Trend',
    outreach_status: 'in_discussion',
    contact_phone: '+6287712348899',
    contact_email: 'chelseadance@gmail.com',
    contact_notes: 'Sedang diskusikan project activation brand minuman untuk dance challenge TikTok.',
    last_contacted_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'link-4',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/C4abcdEfGhI/',
    media_type: 'reel',
    author_username: 'amanda_vlog',
    author_name: 'Amanda Lestari',
    author_avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    author_profile_url: 'https://www.instagram.com/amanda_vlog/',
    title: 'A day in my life sebagai content creator di Jakarta Selatan 🏙️☕ Cafe hopping & editing marathon!',
    thumbnail_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    audio_title: 'Calm Morning Acoustic Jazz',
    audio_author: 'coffeetime_beats',
    hashtags: ['#adayinmylife', '#jakartaselatan', '#cafehopping', '#vlogindonesia', '#aestheticvlog'],
    views_count: 195000,
    likes_count: 16500,
    comments_count: 420,
    shares_count: 610,
    engagement_rate: 9.00,
    rating: 4,
    category_id: 'cat-4',
    tags: ['Daily Vlog', 'Cafe Hopping', 'Aesthetic'],
    hook_type: 'A Day in Life',
    outreach_status: 'saved',
    contact_phone: '',
    contact_email: 'amanda.official@vlogger.id',
    contact_notes: 'Baru disimpan. Vibe video cozy dan visual color grading sangat rapi.',
    last_contacted_at: null,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  }
];

const LOCAL_STORAGE_KEY_CATEGORIES = 'talentpulse_categories_v1';
const LOCAL_STORAGE_KEY_LINKS = 'talentpulse_saved_links_v1';

// Helpers for Local Storage
function getLocalCategories(): Category[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading categories from localStorage:', e);
    return INITIAL_CATEGORIES;
  }
}

function saveLocalCategories(categories: Category[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
}

function getLocalLinks(): SavedLink[] {
  if (typeof window === 'undefined') return INITIAL_LINKS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_LINKS);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY_LINKS, JSON.stringify(INITIAL_LINKS));
      return INITIAL_LINKS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading links from localStorage:', e);
    return INITIAL_LINKS;
  }
}

function saveLocalLinks(links: SavedLink[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY_LINKS, JSON.stringify(links));
}

// ==========================================
// DB SERVICE API
// ==========================================

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (err) {
      console.warn('Supabase fetchCategories failed, falling back to local:', err);
    }
  }
  return getLocalCategories();
}

export async function createCategory(cat: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  const newCat: Category = {
    ...cat,
    id: `cat-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').insert([cat]).select().single();
      if (!error && data) return data as Category;
    } catch (err) {
      console.warn('Supabase createCategory failed, falling back to local:', err);
    }
  }

  const existing = getLocalCategories();
  const updated = [...existing, newCat];
  saveLocalCategories(updated);
  return newCat;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteCategory failed:', err);
    }
  }
  const existing = getLocalCategories();
  const updated = existing.filter((c) => c.id !== id);
  saveLocalCategories(updated);
  return true;
}

export async function fetchSavedLinks(): Promise<SavedLink[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('saved_links').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as SavedLink[];
      }
    } catch (err) {
      console.warn('Supabase fetchSavedLinks failed, falling back to local:', err);
    }
  }
  return getLocalLinks();
}

export async function createSavedLink(link: Omit<SavedLink, 'id' | 'created_at' | 'updated_at'>): Promise<SavedLink> {
  const now = new Date().toISOString();
  const newLink: SavedLink = {
    ...link,
    id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('saved_links').insert([link]).select().single();
      if (!error && data) return data as SavedLink;
    } catch (err) {
      console.warn('Supabase createSavedLink failed, falling back to local:', err);
    }
  }

  const existing = getLocalLinks();
  const updated = [newLink, ...existing];
  saveLocalLinks(updated);
  return newLink;
}

export async function updateSavedLink(id: string, updates: Partial<SavedLink>): Promise<SavedLink | null> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('saved_links')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as SavedLink;
    } catch (err) {
      console.warn('Supabase updateSavedLink failed, falling back to local:', err);
    }
  }

  const existing = getLocalLinks();
  let updatedItem: SavedLink | null = null;
  const updated = existing.map((item) => {
    if (item.id === id) {
      updatedItem = { ...item, ...updates, updated_at: now };
      return updatedItem;
    }
    return item;
  });

  saveLocalLinks(updated);
  return updatedItem;
}

export async function deleteSavedLink(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('saved_links').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteSavedLink failed:', err);
    }
  }
  const existing = getLocalLinks();
  const updated = existing.filter((item) => item.id !== id);
  saveLocalLinks(updated);
  return true;
}

export async function updateOutreachStatus(id: string, status: OutreachStatus): Promise<SavedLink | null> {
  const updates: Partial<SavedLink> = {
    outreach_status: status,
    ...(status === 'contacted' ? { last_contacted_at: new Date().toISOString() } : {}),
  };
  return updateSavedLink(id, updates);
}
