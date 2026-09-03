import { Category, SavedLink, OutreachStatus } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-chindo', name: 'Chindo', slug: 'chindo', color: '#ec4899', icon: 'sparkles', is_system: true },
  { id: 'cat-lokal', name: 'Lokal / Indo', slug: 'lokal-indo', color: '#f59e0b', icon: 'smile', is_system: true },
  { id: 'cat-hijab', name: 'Hijab / Muslimah', slug: 'hijab-muslimah', color: '#10b981', icon: 'heart', is_system: true },
  { id: 'cat-fienshyt', name: 'Fienshyt / Edgy', slug: 'fienshyt-edgy', color: '#8b5cf6', icon: 'flame', is_system: true },
  { id: 'cat-bocil', name: 'Bocil / Remaja', slug: 'bocil-remaja', color: '#06b6d4', icon: 'star', is_system: true },
  { id: 'cat-dokter', name: 'Dokter & Profesi', slug: 'dokter-profesi', color: '#14b8a6', icon: 'activity', is_system: true },
  { id: 'cat-cosplay', name: 'Cosplay & Anime', slug: 'cosplay-anime', color: '#c084fc', icon: 'palette', is_system: true },
  { id: 'cat-kampus', name: 'Kampus & Mahasiswi', slug: 'kampus-mahasiswi', color: '#3b82f6', icon: 'book-open', is_system: true },
  { id: 'cat-penting', name: 'Penting (Prioritas)', slug: 'penting-prioritas', color: '#fbbf24', icon: 'star', is_system: true },
  { id: 'cat-1', name: 'Fashion & OOTD', slug: 'fashion-ootd', color: '#ec4899', icon: 'shirt', is_system: true },
  { id: 'cat-2', name: 'Beauty & Skincare', slug: 'beauty-skincare', color: '#f43f5e', icon: 'sparkles', is_system: true },
  { id: 'cat-3', name: 'Dance & Trends', slug: 'dance-trends', color: '#a855f7', icon: 'music', is_system: true },
  { id: 'cat-4', name: 'Lifestyle & Vlog', slug: 'lifestyle-vlog', color: '#06b6d4', icon: 'camera', is_system: true },
];

import initialRealLinks from './initialLinks.json';
const INITIAL_LINKS: SavedLink[] = initialRealLinks as unknown as SavedLink[];

export const TALENT_TYPES = [
  'Chindo',
  'Lokal / Indo',
  'Hijab / Muslimah',
  'Fienshyt / Edgy',
  'Bocil / Remaja',
  'Bule / Blasteran',
  'Korean Look',
  'Lainnya',
];

export interface SupabaseStatusResult {
  isConfigured: boolean;
  isConnected: boolean;
  tablesExist: boolean;
  message: string;
  projectUrl?: string;
}

export async function checkSupabaseStatus(): Promise<SupabaseStatusResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!isSupabaseConfigured || !supabase) {
    return {
      isConfigured: false,
      isConnected: false,
      tablesExist: false,
      message: 'Supabase URL & Key belum diisi. Aplikasi berjalan dalam mode Local-First (Offline/Local Storage).',
    };
  }

  try {
    const { data, error } = await supabase.from('categories').select('id').limit(1);
    if (error) {
      if (error.message.includes('Could not find the table') || error.code === '42P01') {
        return {
          isConfigured: true,
          isConnected: true,
          tablesExist: false,
          message: 'Terhubung ke Supabase Cloud! Namun tabel belum dibuat. Harap jalankan supabase/schema.sql di Supabase SQL Editor.',
          projectUrl: url,
        };
      }
      return {
        isConfigured: true,
        isConnected: false,
        tablesExist: false,
        message: `Error koneksi Supabase: ${error.message}`,
        projectUrl: url,
      };
    }

    return {
      isConfigured: true,
      isConnected: true,
      tablesExist: true,
      message: 'Berhasil terhubung ke Supabase Cloud Database! Sinkronisasi real-time aktif.',
      projectUrl: url,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      tablesExist: false,
      message: `Gagal menjangkau Supabase: ${err.message}`,
      projectUrl: url,
    };
  }
}

const LOCAL_STORAGE_KEY_CATEGORIES = 'talentpulse_categories_v4';
const LOCAL_STORAGE_KEY_LINKS = 'talentpulse_saved_links_v4';

// Helpers for Local Storage
function getLocalCategories(): Category[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
    if (!data) {
      localStorage.removeItem('talentpulse_categories_v1');
      localStorage.removeItem('talentpulse_categories_v2');
      localStorage.removeItem('talentpulse_categories_v3');
      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length < INITIAL_CATEGORIES.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return parsed;
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
      localStorage.removeItem('talentpulse_saved_links_v1');
      localStorage.removeItem('talentpulse_saved_links_v2');
      localStorage.removeItem('talentpulse_saved_links_v3');
      localStorage.setItem(LOCAL_STORAGE_KEY_LINKS, JSON.stringify(INITIAL_LINKS));
      return INITIAL_LINKS;
    }
    const parsed = JSON.parse(data);
    return parsed;
  } catch (e) {
    console.error('Error reading links from localStorage:', e);
    return INITIAL_LINKS;
  }
}

export function resetToRealUserLinks(): SavedLink[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('talentpulse_saved_links_v1');
    localStorage.removeItem('talentpulse_saved_links_v2');
    localStorage.removeItem('talentpulse_saved_links_v3');
    localStorage.removeItem('talentpulse_categories_v1');
    localStorage.removeItem('talentpulse_categories_v2');
    localStorage.removeItem('talentpulse_categories_v3');
    localStorage.setItem(LOCAL_STORAGE_KEY_LINKS, JSON.stringify(INITIAL_LINKS));
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  return INITIAL_LINKS;
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
