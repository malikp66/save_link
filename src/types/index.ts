export type Platform = 'instagram' | 'tiktok';

export type OutreachStatus = 
  | 'saved' 
  | 'shortlisted' 
  | 'contacted' 
  | 'in_discussion' 
  | 'collaborated' 
  | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  is_system?: boolean;
  created_at?: string;
}

export interface SavedLink {
  id: string;
  platform: Platform;
  url: string;
  media_type: 'reel' | 'post' | 'video' | 'story';
  author_username: string;
  author_name: string;
  author_avatar_url?: string;
  author_profile_url?: string;
  title: string;
  thumbnail_url?: string;
  embed_html?: string;
  audio_title?: string;
  audio_author?: string;
  hashtags: string[];
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  engagement_rate: number; // percentage, e.g. 5.42
  rating: number; // 0-5
  category_id?: string | null;
  tags: string[];
  hook_type?: string;
  outreach_status: OutreachStatus;
  contact_phone?: string;
  contact_email?: string;
  contact_notes?: string;
  last_contacted_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ParsedLinkData {
  platform: Platform;
  url: string;
  media_type: 'reel' | 'post' | 'video' | 'story';
  author_username: string;
  author_name: string;
  author_avatar_url: string;
  author_profile_url: string;
  title: string;
  thumbnail_url: string;
  embed_html?: string;
  audio_title?: string;
  audio_author?: string;
  hashtags: string[];
  views_count?: number;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  engagement_rate?: number;
}
