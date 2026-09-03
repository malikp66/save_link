import { SavedLink, CreatorProfile, Platform } from '@/types';

export function aggregateCreatorProfiles(links: SavedLink[]): CreatorProfile[] {
  const map: Record<string, CreatorProfile> = {};

  for (const link of links) {
    const rawUsername = link.author_username || 'unknown_creator';
    const key = rawUsername.toLowerCase().trim();

    if (!map[key]) {
      map[key] = {
        id: key,
        username: rawUsername,
        name: link.author_name || rawUsername,
        avatar_url: link.author_avatar_url,
        profile_url: link.author_profile_url || (link.platform === 'tiktok' ? `https://www.tiktok.com/@${rawUsername}` : `https://www.instagram.com/${rawUsername}/`),
        platforms: [link.platform],
        talent_type: link.talent_type || 'Lokal / Indo',
        rating: link.rating || 4,
        outreach_status: link.outreach_status || 'saved',
        contact_phone: link.contact_phone || '',
        contact_email: link.contact_email || '',
        contact_notes: link.contact_notes || '',
        items: [],
        total_views: 0,
        total_likes: 0,
        total_comments: 0,
        total_shares: 0,
        avg_engagement_rate: 0,
        last_activity_at: link.created_at,
      };
    }

    const profile = map[key];
    profile.items.push(link);

    // If platform not in platforms array, add it
    if (!profile.platforms.includes(link.platform)) {
      profile.platforms.push(link.platform);
    }

    // Pick best name / avatar
    if (link.author_name && (!profile.name || profile.name === rawUsername)) {
      profile.name = link.author_name;
    }
    if (link.author_avatar_url && !profile.avatar_url) {
      profile.avatar_url = link.author_avatar_url;
    }

    // Accumulate metrics
    profile.total_views += Number(link.views_count) || 0;
    profile.total_likes += Number(link.likes_count) || 0;
    profile.total_comments += Number(link.comments_count) || 0;
    profile.total_shares += Number(link.shares_count) || 0;

    // Highest rating & best outreach status
    if ((link.rating || 0) > profile.rating) {
      profile.rating = link.rating;
    }
    if (link.outreach_status === 'shortlisted' && profile.outreach_status === 'saved') {
      profile.outreach_status = 'shortlisted';
    }
    if (link.outreach_status === 'contacted') {
      profile.outreach_status = 'contacted';
    }
    if (link.contact_email && !profile.contact_email) {
      profile.contact_email = link.contact_email;
    }
    if (link.contact_phone && !profile.contact_phone) {
      profile.contact_phone = link.contact_phone;
    }
    if (link.talent_type && (!profile.talent_type || profile.talent_type === 'Lokal / Indo')) {
      profile.talent_type = link.talent_type;
    }
  }

  // Calculate average ER & sort items by views descending
  const profiles = Object.values(map).map((p) => {
    const totalItems = p.items.length;
    const totalER = p.items.reduce((sum, item) => sum + (Number(item.engagement_rate) || 0), 0);
    p.avg_engagement_rate = totalItems > 0 ? Number((totalER / totalItems).toFixed(2)) : 0;
    
    // Sort creator's items by views descending
    p.items.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));

    return p;
  });

  // Default sort: Profiles with multiple contents first, then by total views descending
  return profiles.sort((a, b) => {
    if (b.items.length !== a.items.length) {
      return b.items.length - a.items.length; // multi-content first
    }
    return b.total_views - a.total_views;
  });
}
