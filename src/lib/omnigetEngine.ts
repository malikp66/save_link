import { Platform, ParsedLinkData } from '@/types';

export interface OmnigetMediaStream {
  url: string;
  quality: string;
  format: string;
  hasAudio: boolean;
  hasVideo: boolean;
  fileSizeApprox?: number;
}

export interface OmnigetExtractionResult extends ParsedLinkData {
  extractor: 'omniget' | 'opennami' | 'ytdlp' | 'fallback';
  direct_media_url?: string;
  streams?: OmnigetMediaStream[];
  transcription?: string;
  duration?: number;
  description?: string;
  subtitles?: Array<{ lang: string; url: string }>;
}

/**
 * Detect platform with extended OpenSelena 1,800+ sites support
 */
export function detectExtendedPlatform(rawUrl: string): Platform {
  const url = rawUrl.toLowerCase();
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com') || url.includes('vt.tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('reddit.com')) return 'reddit';
  if (url.includes('bilibili.com')) return 'bilibili';
  if (url.includes('pinterest.com') || url.includes('pin.it')) return 'pinterest';
  if (url.includes('twitch.tv')) return 'twitch';
  if (url.includes('threads.net')) return 'threads';
  return 'other';
}

/**
 * Normalize and clean URLs for OpenSelena extractors
 */
export function cleanMediaUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());
    // Strip common tracking and referrer query params
    const strippedParams = ['utm_source', 'utm_medium', 'utm_campaign', 'igsh', 'cplk', 'mdxt', 'srtk', 'exln', 'si'];
    strippedParams.forEach(p => parsed.searchParams.delete(p));
    return parsed.toString();
  } catch {
    return rawUrl.trim();
  }
}

/**
 * OpenSelena & OmniGet Media Adapter Engine
 * Connects to local yt-dlp / openomni CLI or remote JSON-RPC MCP Bridge
 */
export async function extractWithOmniget(rawUrl: string): Promise<OmnigetExtractionResult> {
  const cleanUrl = cleanMediaUrl(rawUrl);
  const platform = detectExtendedPlatform(cleanUrl);

  // Default baseline response
  const baseline: OmnigetExtractionResult = {
    platform,
    url: cleanUrl,
    media_type: 'video',
    author_username: '',
    author_name: '',
    author_avatar_url: '',
    author_profile_url: '',
    title: '',
    thumbnail_url: '',
    hashtags: [],
    extractor: 'omniget',
  };

  // If running in Node/Server environment with child_process capabilities
  if (typeof window === 'undefined') {
    try {
      const { exec } = await import('child_process');
      const util = await import('util');
      const execAsync = util.promisify(exec);

      // Try yt-dlp JSON dump
      const { stdout } = await execAsync(, {
        timeout: 15000,
      });

      if (stdout) {
        const info = JSON.parse(stdout);
        const tags = Array.isArray(info.tags) ? info.tags : [];
        const descriptionTags = (info.description || '').match(/#[\w\u0590-\u05ff]+/gi) || [];
        const mergedHashtags = Array.from(new Set([...tags, ...descriptionTags]));

        return {
          ...baseline,
          title: info.title || info.fulltitle || '',
          author_username: info.uploader_id || info.channel_id || info.uploader || '',
          author_name: info.uploader || info.channel || '',
          author_profile_url: info.uploader_url || info.channel_url || '',
          thumbnail_url: info.thumbnail || '',
          views_count: info.view_count || 0,
          likes_count: info.like_count || 0,
          comments_count: info.comment_count || 0,
          duration: info.duration,
          description: info.description,
          hashtags: mergedHashtags,
          extractor: 'ytdlp',
          direct_media_url: info.url || (info.formats && info.formats[info.formats.length - 1]?.url),
        };
      }
    } catch (err) {
      // Fallback gracefully to public oEmbed or parser
      console.warn('yt-dlp execution unavailable, falling back to standard extractor:', err);
    }
  }

  return baseline;
}
