'use client';

import React from 'react';
import { 
  SavedLink, 
  Category, 
  OutreachStatus 
} from '@/types';
import { 
  Heart, 
  Eye, 
  MessageCircle, 
  Share2, 
  Star, 
  ExternalLink, 
  Send, 
  Music,
  Trash2,
  TrendingUp
} from 'lucide-react';

interface ContentCardProps {
  item: SavedLink;
  category?: Category;
  onOpenDetail: (item: SavedLink) => void;
  onUpdateStatus: (id: string, status: OutreachStatus) => void;
  onDelete: (id: string) => void;
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
  onOpenDetail,
  onUpdateStatus,
  onDelete,
}: ContentCardProps) {
  const isTiktok = item.platform === 'tiktok';

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
        overflow: 'hidden',
        position: 'relative',
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
        }}
        onClick={() => onOpenDetail(item)}
      >
        {item.thumbnail_url ? (
          <img 
            src={item.thumbnail_url} 
            alt={item.title || 'Preview konten'} 
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
              // fallback image if broken link
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
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
        }}>
          {/* Platform Badge */}
          <span className={`badge ${isTiktok ? 'badge-tiktok' : 'badge-ig'}`}>
            {isTiktok ? 'TikTok' : 'Instagram'}
          </span>

          {/* Engagement Rate Badge */}
          {item.engagement_rate > 0 && (
            <span className="badge badge-er">
              <TrendingUp size={12} />
              {item.engagement_rate.toFixed(1)}% ER
            </span>
          )}
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
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--border-subtle)',
              }}
            />
            <div style={{ overflow: 'hidden' }}>
              <a 
                href={item.author_profile_url || item.url} 
                target="_blank" 
                rel="noreferrer"
                style={{ 
                  fontSize: '0.84rem', 
                  fontWeight: 700, 
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                title={item.author_name}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  @{item.author_username}
                </span>
                <ExternalLink size={11} color="var(--text-dim)" />
              </a>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

        {/* Category & Hook Tag */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {category && (
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
          )}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Likes">
            <Heart size={13} color="#f43f5e" />
            <span>{formatNumber(item.likes_count)}</span>
          </div>
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
          {/* Status Dropdown */}
          <select
            value={item.outreach_status}
            onChange={(e) => onUpdateStatus(item.id, e.target.value as OutreachStatus)}
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '140px',
            }}
          >
            <option value="saved">📥 Tersimpan</option>
            <option value="shortlisted">⭐ Tertarik</option>
            <option value="contacted">💬 Sudah di-DM</option>
            <option value="in_discussion">🤝 Sedang Diskusi</option>
            <option value="collaborated">🎉 Deal / Collab</option>
            <option value="archived">⚪ Lewat</option>
          </select>

          {/* Action buttons: DM & Delete */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
