'use client';

import React, { useState, useRef } from 'react';
import { 
  SavedLink, 
  Category, 
  OutreachStatus 
} from '@/types';
import CustomSelect, { SelectOption } from './CustomSelect';
import CopyUsernameBadge from './CopyUsernameBadge';
import { 
  Eye, 
  MessageCircle, 
  Share2, 
  Star, 
  ExternalLink, 
  Send, 
  Music,
  Trash2,
  TrendingUp,
  Pencil
} from 'lucide-react';

const OUTREACH_OPTIONS: SelectOption[] = [
  { value: 'saved', label: 'Tersimpan', icon: '📥', color: '#cbd5e1' },
  { value: 'shortlisted', label: 'Tertarik', icon: '⭐', color: '#fbbf24' },
  { value: 'contacted', label: 'Sudah di-DM', icon: '💬', color: '#c084fc' },
  { value: 'in_discussion', label: 'Diskusi', icon: '🤝', color: '#38bdf8' },
  { value: 'collaborated', label: 'Deal/Collab', icon: '🎉', color: '#34d399' },
  { value: 'archived', label: 'Lewat', icon: '⚪', color: '#94a3b8' },
];

interface ContentCardProps {
  item: SavedLink;
  category?: Category;
  categories?: Category[];
  onOpenDetail: (item: SavedLink) => void;
  onUpdateStatus: (id: string, status: OutreachStatus) => void;
  onUpdateCategory?: (id: string, categoryId: string | null) => void;
  onDelete: (id: string) => void;
  onOpenCreatorProfile?: (username: string) => void;
  onToggleLike?: (id: string, currentlyLiked: boolean) => void;
}

const STATUS_LABELS: Record<OutreachStatus, { label: string; className: string }> = {
  saved: { label: 'Tersimpan', className: 'badge-status-saved' },
  shortlisted: { label: 'Tertarik ⭐', className: 'badge-status-shortlisted' },
  contacted: { label: 'Sudah di-DM 💬', className: 'badge-status-contacted' },
  in_discussion: { label: 'Sedang Diskusi 🤝', className: 'badge-status-in_discussion' },
  collaborated: { label: 'Deal / Collab 🎉', className: 'badge-status-collaborated' },
  archived: { label: 'Arsip / Lewat', className: 'badge-status-archived' },
};

export default function ContentCard({
  item,
  category,
  categories,
  onOpenDetail,
  onUpdateStatus,
  onUpdateCategory,
  onDelete,
  onOpenCreatorProfile,
  onToggleLike,
}: ContentCardProps) {
  const isTiktok = item.platform === 'tiktok';
  const [showSplash, setShowSplash] = useState(false);
  const lastTapRef = useRef<number>(0);
  const singleClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerLikeSplash = () => {
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 850);
    if (onToggleLike) {
      onToggleLike(item.id, !!item.is_liked);
    }
  };

  const handleMediaClick = (e: React.MouseEvent) => {
    if (singleClickTimerRef.current) {
      clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
      triggerLikeSplash();
    } else {
      singleClickTimerRef.current = setTimeout(() => {
        singleClickTimerRef.current = null;
        onOpenDetail(item);
      }, 250);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      if (singleClickTimerRef.current) {
        clearTimeout(singleClickTimerRef.current);
        singleClickTimerRef.current = null;
      }
      triggerLikeSplash();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const statusInfo = STATUS_LABELS[item.outreach_status] || STATUS_LABELS.saved;

  return (
    <div 
      className="glass-panel-interactive" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Media Thumbnail Container */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '125%', // 4:5 vertical video ratio
          backgroundColor: '#111422',
          cursor: 'pointer',
          overflow: 'hidden',
          borderTopLeftRadius: 'var(--radius-md)',
          borderTopRightRadius: 'var(--radius-md)',
        }}
        onClick={handleMediaClick}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background shimmer placeholder while image loads */}
        <div className="skeleton-shimmer" style={{ position: 'absolute', inset: 0 }} />

        {/* Double-Tap Water Splash Overlay (Air Muncrat 💦) */}
        {showSplash && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 35,
              pointerEvents: 'none',
            }}
          >
            <div
              className="double-tap-splash"
              style={{
                fontSize: '5rem',
                filter: 'drop-shadow(0 0 24px rgba(56, 189, 248, 0.9))',
                userSelect: 'none',
              }}
            >
              💦
            </div>
          </div>
        )}

        {item.thumbnail_url ? (
          <img 
            src={item.thumbnail_url} 
            alt={item.title || 'Preview konten'} 
            referrerPolicy="no-referrer"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (!img.src.includes('/api/proxy-image') && item.thumbnail_url && item.thumbnail_url.startsWith('http')) {
                img.src = `/api/proxy-image?url=${encodeURIComponent(item.thumbnail_url)}`;
              } else {
                img.src = '/storage/placeholder-card.svg';
              }
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e1b4b, #311042)',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            Preview Konten
          </div>
        )}

        {/* Top Badges Overlay */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          {/* Platform Badge */}
          <span className={`badge ${isTiktok ? 'badge-tiktok' : 'badge-ig'}`}>
            {isTiktok ? 'TikTok' : 'Instagram'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'auto' }}>
            {/* Engagement Rate Badge */}
            {item.engagement_rate > 0 && (
              <span className="badge badge-er">
                <TrendingUp size={12} />
                {item.engagement_rate.toFixed(1)}% ER
              </span>
            )}

            {/* Wishlist / Like button with 💦 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerLikeSplash();
              }}
              title={item.is_liked ? "Wishlist aktif 💦 (Klik untuk lepas)" : "Tambah Wishlist 💦 (Double tap foto)"}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: item.is_liked 
                  ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(14, 165, 233, 0.9))' 
                  : 'rgba(0, 0, 0, 0.55)',
                border: item.is_liked ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 600,
                boxShadow: item.is_liked ? '0 0 14px rgba(56, 189, 248, 0.6)' : 'none',
                transform: item.is_liked ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <span style={{ fontSize: '13px', lineHeight: 1 }}>💦</span>
              {item.is_liked && <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>Wishlist</span>}
            </button>
          </div>
        </div>

        {/* Play Overlay indicator on hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10, 11, 18, 0.9) 0%, transparent 60%)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 12,
        }}>
          {/* Audio Sound Title if available */}
          {item.audio_title && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.72rem',
              color: '#e2e8f0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(8px)',
            }}>
              <Music size={11} color="#a855f7" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.audio_title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Details */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        {/* Creator Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <img 
              src={item.author_avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${item.author_username}`} 
              alt={item.author_name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.src.includes('/api/proxy-image') && item.author_avatar_url && item.author_avatar_url.startsWith('http')) {
                  img.src = `/api/proxy-image?url=${encodeURIComponent(item.author_avatar_url)}`;
                } else {
                  img.src = `https://api.dicebear.com/7.x/personas/svg?seed=${item.author_username}`;
                }
              }}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--border-subtle)',
                background: '#1a1d2e',
                flexShrink: 0,
              }}
            />
            <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CopyUsernameBadge username={item.author_username} size="sm" />
                <a 
                  href={item.author_profile_url || item.url} 
                  target="_blank" 
                  rel="noreferrer"
                  title={`Buka Profil Asli @${item.author_username}`}
                  style={{ 
                    color: 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 4,
                    transition: 'color 0.15s ease',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#38bdf8')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-dim)')}
                >
                  <ExternalLink size={11} />
                </a>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                {item.author_name}
              </p>
            </div>
          </div>

          {/* Rating Stars */}
          {item.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} title={`Rating: ${item.rating}/5`}>
              <Star size={13} fill="#fbbf24" color="#fbbf24" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>{item.rating}</span>
            </div>
          )}
        </div>

        {/* Link Type Badge & Telaah Akun Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, margin: '2px 0' }}>
          <span style={{
            fontSize: '0.66rem',
            padding: '2px 6px',
            borderRadius: 4,
            fontWeight: 600,
            background: item.url.includes('/p/') || item.url.includes('/reel/') || item.url.includes('tiktok') 
              ? 'rgba(6, 182, 212, 0.15)' 
              : 'rgba(168, 85, 247, 0.15)',
            color: item.url.includes('/p/') || item.url.includes('/reel/') || item.url.includes('tiktok') 
              ? '#22d3ee' 
              : '#c084fc',
            border: item.url.includes('/p/') || item.url.includes('/reel/') || item.url.includes('tiktok') 
              ? '1px solid rgba(6, 182, 212, 0.3)' 
              : '1px solid rgba(168, 85, 247, 0.3)',
          }}>
            {item.url.includes('/p/') || item.url.includes('/reel/') || item.url.includes('tiktok') ? '🎬 Link Konten Video' : '👤 Link Akun Profil'}
          </span>

          {onOpenCreatorProfile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCreatorProfile(item.author_username);
              }}
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#f472b6',
                background: 'rgba(236, 72, 153, 0.12)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '2px 7px',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
              }}
              title={`Telaah Akun @${item.author_username}`}
            >
              <span>🔍 Telaah Akun</span>
            </button>
          )}
        </div>

        {/* Caption Snippet */}
        <p 
          onClick={() => onOpenDetail(item)}
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {item.title || 'Tanpa keterangan'}
        </p>

        {/* Category, Talent Type & Hook Tag */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {item.talent_type && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(236, 72, 153, 0.15)',
              color: '#f472b6',
              border: '1px solid rgba(236, 72, 153, 0.35)',
            }}>
              {item.talent_type}
            </span>
          )}

          {categories && categories.length > 0 && onUpdateCategory ? (
            <div onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex' }}>
              <CustomSelect
                value={item.category_id || ''}
                onChange={(catId) => onUpdateCategory(item.id, catId ? catId : null)}
                options={[
                  { value: '', label: 'Tanpa Kategori', color: '#94a3b8' },
                  ...categories.map((c) => ({ value: c.id, label: c.name, color: c.color })),
                ]}
                placeholder="+ Kategori"
                size="sm"
                width={125}
              />
            </div>
          ) : category ? (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: `${category.color}15`,
              color: category.color,
              border: `1px solid ${category.color}40`,
            }}>
              {category.name}
            </span>
          ) : null}

          {item.hook_type && (
            <span style={{
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#94a3b8',
            }}>
              {item.hook_type}
            </span>
          )}
        </div>

        {/* Metrics Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'rgba(255, 255, 255, 0.025)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Estimasi Views">
            <Eye size={13} color="var(--text-dim)" />
            <span>{formatNumber(item.views_count)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerLikeSplash();
            }}
            title={item.is_liked ? "Disukai / Wishlist 💦 (Klik untuk batal)" : "Suka / Wishlist 💦 (Double tap foto)"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: item.is_liked ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
              border: item.is_liked ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 6px',
              cursor: 'pointer',
              color: item.is_liked ? '#38bdf8' : 'inherit',
              transition: 'all 0.18s ease',
            }}
          >
            <span style={{ fontSize: '13px', lineHeight: 1 }}>💦</span>
            <span style={{ fontWeight: item.is_liked ? 700 : 500 }}>
              {formatNumber(item.likes_count + (item.is_liked ? 1 : 0))}
            </span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Komentar">
            <MessageCircle size={13} color="var(--accent-cyan)" />
            <span>{formatNumber(item.comments_count)}</span>
          </div>
        </div>

        {/* Outreach Status Selector & Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          paddingTop: 8,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          {/* Status Custom Dropdown */}
          <CustomSelect
            value={item.outreach_status}
            onChange={(val) => onUpdateStatus(item.id, val as OutreachStatus)}
            options={OUTREACH_OPTIONS}
            size="sm"
            width={130}
          />

          {/* Action buttons: Edit, DM & Delete */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => onOpenDetail(item)}
              title="Edit Konten & Kategori"
              style={{
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(6, 182, 212, 0.12)',
                color: '#22d3ee',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.72rem',
                fontWeight: 600,
                border: '1px solid rgba(6, 182, 212, 0.28)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(6, 182, 212, 0.22)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(6, 182, 212, 0.12)')}
            >
              <Pencil size={11} />
              <span>Edit</span>
            </button>

            <a
              href={item.author_profile_url || item.url}
              target="_blank"
              rel="noreferrer"
              title="Kirim Pesan / Touch Up"
              style={{
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <Send size={12} />
              <span>DM</span>
            </a>

            <button
              onClick={() => onDelete(item.id)}
              title="Hapus Link"
              style={{
                padding: 6,
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-dim)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f43f5e')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-dim)')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
