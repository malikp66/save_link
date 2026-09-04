'use client';

import React, { useState, useMemo } from 'react';
import { CreatorProfile, SavedLink, Category, OutreachStatus, Platform } from '@/types';
import CustomSelect, { SelectOption } from './CustomSelect';
import CopyUsernameBadge from './CopyUsernameBadge';
import { 
  Users2, 
  Search, 
  ExternalLink, 
  Film, 
  TrendingUp, 
  Eye, 
  Heart, 
  Sparkles, 
  Star,
  CheckCircle2,
  Filter
} from 'lucide-react';

const SORT_OPTIONS: SelectOption[] = [
  { value: 'most_content', label: 'Konten Terbanyak' },
  { value: 'highest_views', label: 'Total Views Tertinggi' },
  { value: 'highest_er', label: 'Rata-Rata ER Tertinggi' },
  { value: 'rating', label: 'Rating Bakat Tertinggi' },
];

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Semua Status CRM' },
  { value: 'saved', label: 'Tersimpan', icon: '📥' },
  { value: 'shortlisted', label: 'Tertarik / Prioritas', icon: '⭐' },
  { value: 'contacted', label: 'Sudah di-DM', icon: '💬' },
  { value: 'in_discussion', label: 'Sedang Diskusi', icon: '🤝' },
  { value: 'collaborated', label: 'Deal / Collab', icon: '🎉' },
];

interface ProfilesViewProps {
  profiles: CreatorProfile[];
  categories: Category[];
  onSelectProfile: (profile: CreatorProfile) => void;
  onUpdateStatus: (linkIds: string[], status: OutreachStatus) => void;
}

export default function ProfilesView({
  profiles,
  categories,
  onSelectProfile,
  onUpdateStatus,
}: ProfilesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | Platform>('all');
  const [multiOnly, setMultiOnly] = useState(false);
  const [talentTypeFilter, setTalentTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'most_content' | 'highest_views' | 'highest_er' | 'rating'>('most_content');

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  // Stats calculation
  const totalProfiles = profiles.length;
  const multiContentProfiles = profiles.filter((p) => p.items.length > 1);
  const tiktokProfiles = profiles.filter((p) => p.platforms.includes('tiktok')).length;
  const igProfiles = profiles.filter((p) => p.platforms.includes('instagram')).length;

  // Filtered and sorted profiles
  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((p) => {
        // Multi-content filter
        if (multiOnly && p.items.length <= 1) return false;

        // Platform filter
        if (platformFilter !== 'all' && !p.platforms.includes(platformFilter)) return false;

        // Talent type filter
        if (talentTypeFilter !== 'all' && p.talent_type !== talentTypeFilter) return false;

        // Status filter
        if (statusFilter !== 'all' && p.outreach_status !== statusFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchUser = p.username.toLowerCase().includes(q);
          const matchName = p.name.toLowerCase().includes(q);
          const matchNotes = p.contact_notes?.toLowerCase().includes(q);
          const matchTitles = p.items.some((i) => i.title?.toLowerCase().includes(q));
          if (!matchUser && !matchName && !matchNotes && !matchTitles) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'most_content') {
          if (b.items.length !== a.items.length) {
            return b.items.length - a.items.length;
          }
          return b.total_views - a.total_views;
        }
        if (sortBy === 'highest_views') {
          return b.total_views - a.total_views;
        }
        if (sortBy === 'highest_er') {
          return b.avg_engagement_rate - a.avg_engagement_rate;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [profiles, searchQuery, platformFilter, multiOnly, talentTypeFilter, statusFilter, sortBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 10 }}>
      {/* Top Banner & KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
      }}>
        <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#c084fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Users2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Total Akun / Profil</span>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {totalProfiles} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Kreator</span>
            </p>
          </div>
        </div>

        <div 
          className="glass-panel" 
          onClick={() => setMultiOnly(!multiOnly)}
          style={{ 
            padding: '16px 18px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 14,
            cursor: 'pointer',
            border: multiOnly ? '1px solid #10b981' : undefined,
            background: multiOnly ? 'rgba(16, 185, 129, 0.1)' : undefined,
          }}
          title="Klik untuk filter hanya akun dengan banyak konten"
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Film size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>
              🔥 {multiOnly ? 'Sedang Aktif' : 'Klik Filter'}
            </span>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#34d399' }}>
              {multiContentProfiles.length} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Akun Multi-Konten</span>
            </p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(6, 182, 212, 0.15)',
            color: '#22d3ee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Rasio Platform</span>
            <p style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              <span style={{ color: '#22d3ee' }}>{tiktokProfiles} TT</span> / <span style={{ color: '#fb7185' }}>{igProfiles} IG</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{
            flex: 1,
            minWidth: 260,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 12 }} />
            <input
              type="text"
              placeholder="Cari profil, @username, nama talent, atau topik konten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Quick Platform Buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setPlatformFilter('all')}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: platformFilter === 'all' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                color: platformFilter === 'all' ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Semua Platform
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: platformFilter === 'tiktok' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: platformFilter === 'tiktok' ? '#22d3ee' : 'var(--text-muted)',
                border: platformFilter === 'tiktok' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-subtle)',
              }}
            >
              TikTok
            </button>
            <button
              onClick={() => setPlatformFilter('instagram')}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: platformFilter === 'instagram' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: platformFilter === 'instagram' ? '#fb7185' : 'var(--text-muted)',
                border: platformFilter === 'instagram' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-subtle)',
              }}
            >
              Instagram
            </button>
          </div>

          {/* Multi-Content Quick Toggle */}
          <button
            onClick={() => setMultiOnly(!multiOnly)}
            style={{
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: multiOnly ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              color: multiOnly ? '#34d399' : 'var(--text-muted)',
              border: multiOnly ? '1px solid #10b981' : '1px solid var(--border-subtle)',
            }}
          >
            🔥 Akun &gt;1 Konten Saja ({multiContentProfiles.length})
          </button>
        </div>

        {/* Dropdowns row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: 10,
        }}>
          {/* Persona Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f472b6' }}>
              Tipe Cewe:
            </span>
            {['all', 'Chindo', 'Lokal / Indo', 'Hijab / Muslimah', 'Fienshyt / Edgy', 'Bocil / Remaja'].map((t) => (
              <button
                key={t}
                onClick={() => setTalentTypeFilter(t)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: talentTypeFilter === t ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  color: talentTypeFilter === t ? '#f472b6' : 'var(--text-muted)',
                  border: talentTypeFilter === t ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid var(--border-subtle)',
                }}
              >
                {t === 'all' ? 'Semua' : t}
              </button>
            ))}
          </div>

          {/* Sort & Status Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={STATUS_FILTER_OPTIONS}
              size="sm"
              width={160}
            />

            <CustomSelect
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
              options={SORT_OPTIONS}
              size="sm"
              width={175}
            />
          </div>
        </div>
      </div>

      {/* Profile Cards Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Users2 size={40} color="var(--text-dim)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tidak Ada Profil yang Cocok</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Coba sesuaikan pencarian atau reset filter di atas.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="glass-panel-interactive"
              onClick={() => onSelectProfile(profile)}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {/* Card Top: Avatar, Name, Platform, Badges */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={profile.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${profile.username}`}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.includes('/api/proxy-image') && profile.avatar_url && profile.avatar_url.startsWith('http')) {
                        img.src = `/api/proxy-image?url=${encodeURIComponent(profile.avatar_url)}`;
                      } else {
                        img.src = `https://api.dicebear.com/7.x/personas/svg?seed=${profile.username}`;
                      }
                    }}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(139, 92, 246, 0.4)',
                      background: '#1a1d2e',
                    }}
                  />
                  {profile.platforms.map((p, i) => (
                    <span
                      key={p}
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        right: i * 14,
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        padding: '1px 4px',
                        borderRadius: 4,
                        background: p === 'tiktok' ? '#06b6d4' : 'linear-gradient(45deg, #f09433, #dc2743)',
                        color: '#fff',
                      }}
                    >
                      {p === 'tiktok' ? 'TT' : 'IG'}
                    </span>
                  ))}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <h4 style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      margin: 0,
                      color: 'var(--text-main)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {profile.name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, flexShrink: 0 }}>
                      ⭐ {profile.rating}
                    </span>
                  </div>

                  <div style={{ margin: '3px 0 6px 0' }} onClick={(e) => e.stopPropagation()}>
                    <CopyUsernameBadge username={profile.username} size="xs" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {profile.talent_type && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(236, 72, 153, 0.16)',
                        color: '#f472b6',
                      }}>
                        {profile.talent_type}
                      </span>
                    )}

                    {profile.items.length > 1 ? (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                      }}>
                        🔥 {profile.items.length} Konten
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                      }}>
                        1 Konten
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mini Content Strip Preview */}
              {profile.items.length > 0 && (
                <div style={{ display: 'flex', gap: 6, overflowX: 'hidden' }}>
                  {profile.items.slice(0, 3).map((it, idx) => (
                    <div
                      key={it.id}
                      style={{
                        position: 'relative',
                        flex: 1,
                        height: 60,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        backgroundColor: '#181b2e',
                      }}
                    >
                      {it.thumbnail_url && (
                        <img
                          src={it.thumbnail_url}
                          alt={it.title}
                          referrerPolicy="no-referrer"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <span style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        padding: '1px 3px',
                        borderRadius: 3,
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: '#34d399',
                      }}>
                        {it.engagement_rate}%
                      </span>
                    </div>
                  ))}
                  {profile.items.length > 3 && (
                    <div style={{
                      width: 40,
                      height: 60,
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                    }}>
                      +{profile.items.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Metrics Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.025)',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={13} color="var(--text-dim)" />
                  {formatNumber(profile.total_views)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Heart size={13} color="#f43f5e" />
                  {formatNumber(profile.total_likes)}
                </span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>
                  📈 {profile.avg_engagement_rate}% ER
                </span>
              </div>

              {/* Card Footer: CTA & External Link */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: 8,
              }}>
                <button
                  type="button"
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Lihat {profile.items.length} Konten & Dossier ➔
                </button>

                <a
                  href={profile.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Buka Link Akun Asli"
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.7rem',
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Profil Asli</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
