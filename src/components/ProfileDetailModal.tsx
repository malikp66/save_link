'use client';

import React, { useState } from 'react';
import { CreatorProfile, SavedLink, OutreachStatus, Category } from '@/types';
import CustomSelect, { SelectOption } from './CustomSelect';
import { 
  X, 
  ExternalLink, 
  Send, 
  Phone, 
  Mail, 
  Star, 
  TrendingUp, 
  Heart, 
  Eye, 
  MessageCircle, 
  Share2, 
  Film, 
  Save, 
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const OUTREACH_OPTIONS: SelectOption[] = [
  { value: 'saved', label: 'Tersimpan', icon: '📥', color: '#cbd5e1' },
  { value: 'shortlisted', label: 'Tertarik / Prioritas', icon: '⭐', color: '#fbbf24' },
  { value: 'contacted', label: 'Sudah di-DM', icon: '💬', color: '#c084fc' },
  { value: 'in_discussion', label: 'Sedang Diskusi', icon: '🤝', color: '#38bdf8' },
  { value: 'collaborated', label: 'Deal / Collab', icon: '🎉', color: '#34d399' },
  { value: 'archived', label: 'Lewat / Arsip', icon: '⚪', color: '#94a3b8' },
];

interface ProfileDetailModalProps {
  profile: CreatorProfile;
  categories: Category[];
  onClose: () => void;
  onUpdateStatus: (linkIds: string[], status: OutreachStatus) => void;
  onOpenContentDetail: (item: SavedLink) => void;
}

export default function ProfileDetailModal({
  profile,
  categories,
  onClose,
  onUpdateStatus,
  onOpenContentDetail,
}: ProfileDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<OutreachStatus>(profile.outreach_status);
  const [phone, setPhone] = useState(profile.contact_phone || '');
  const [email, setEmail] = useState(profile.contact_email || '');
  const [notes, setNotes] = useState(profile.contact_notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const handleStatusChange = (newStatus: string) => {
    const status = newStatus as OutreachStatus;
    setCurrentStatus(status);
    const linkIds = profile.items.map((i) => i.id);
    onUpdateStatus(linkIds, status);

    if (status === 'collaborated') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#38bdf8', '#c084fc', '#f472b6'],
      });
    }
  };

  const generateWhatsAppLink = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Halo Kak ${profile.name}! 👋\n\n` +
      `Aku lihat konten-konten keren Kakak di ${profile.platforms.join(' & ')} (@${profile.username}), terutama video yang baru kami kurasi.\n\n` +
      `Kami dari talent team sangat tertarik untuk touch-up dan eksplorasi kolaborasi project campaign brand. Boleh minta rate card & info contact Kakak? Terima kasih banyak!`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 900,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(139, 92, 246, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={17} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                Dossier & Profil Lengkap Talent
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Dikelola dari {profile.items.length} link konten terkurasi
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{
          padding: '20px 22px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {/* Creator Profile Hero Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Big Avatar */}
              <div style={{ position: 'relative' }}>
                <img
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${profile.username}`}
                  alt={profile.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #c084fc',
                    background: '#1a1d2e',
                  }}
                />
                {profile.platforms.map((p, idx) => (
                  <span
                    key={p}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: idx * 16,
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 5px',
                      borderRadius: 6,
                      background: p === 'tiktok' ? '#06b6d4' : 'linear-gradient(45deg, #f09433, #dc2743)',
                      color: '#fff',
                    }}
                  >
                    {p === 'tiktok' ? 'TT' : 'IG'}
                  </span>
                ))}
              </div>

              {/* Identity & Badges */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    {profile.name}
                  </h3>
                  {profile.talent_type && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(236, 72, 153, 0.18)',
                      color: '#f472b6',
                      border: '1px solid rgba(236, 72, 153, 0.35)',
                    }}>
                      {profile.talent_type}
                    </span>
                  )}
                  {profile.items.length > 1 && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                    }}>
                      🔥 {profile.items.length} Konten Tersimpan
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  @{profile.username}
                </p>

                {/* Direct Link to Social Profile */}
                <a
                  href={profile.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '0.76rem',
                    color: 'var(--accent-cyan)',
                    marginTop: 6,
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Kunjungi Akun Profil Asli di {profile.platforms.join(' & ')}</span>
                </a>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Status Pipeline CRM:
              </span>
              <CustomSelect
                value={currentStatus}
                onChange={handleStatusChange}
                options={OUTREACH_OPTIONS}
                size="sm"
              />
            </div>
          </div>

          {/* Aggregate Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 10,
          }}>
            <div className="glass-panel" style={{ padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Total Konten
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                {profile.items.length}
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Total Views
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {formatNumber(profile.total_views)}
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Total Likes
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f43f5e' }}>
                {formatNumber(profile.total_likes)}
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Rata-Rata ER
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                {profile.avg_engagement_rate}%
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Rating Bakat
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
                ⭐ {profile.rating} / 5
              </span>
            </div>
          </div>

          {/* SECTION: ALL SAVED CONTENT FROM THIS SPECIFIC CREATOR */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Film size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  Daftar Konten Tersimpan dari @{profile.username} ({profile.items.length} Video/Post)
                </h4>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Klik pada konten untuk melihat preview & detail analitiknya
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 12,
            }}>
              {profile.items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onOpenContentDetail(item)}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '60%', // 16:10 ratio
                    backgroundColor: '#16192b',
                    overflow: 'hidden',
                  }}>
                    {item.thumbnail_url && (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}

                    {/* Platform Badge */}
                    <span style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: item.platform === 'tiktok' ? '#06b6d4' : 'linear-gradient(45deg, #f09433, #dc2743)',
                      color: '#fff',
                    }}>
                      {item.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                    </span>

                    {/* ER Badge */}
                    <span style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: 'rgba(0, 0, 0, 0.75)',
                      color: '#34d399',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                    }}>
                      📈 {item.engagement_rate}% ER
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      lineHeight: 1.4,
                      margin: '0 0 8px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.title || `Konten #${idx + 1}`}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      paddingTop: 6,
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Eye size={12} /> {formatNumber(item.views_count)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f43f5e' }}>
                        <Heart size={12} /> {formatNumber(item.likes_count)}
                      </span>
                      {item.hook_type && (
                        <span style={{
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: 'rgba(255, 255, 255, 0.06)',
                          fontSize: '0.65rem',
                        }}>
                          {item.hook_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CRM Outreach Touch-Up & Contact Details */}
          <div style={{
            padding: '16px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Send size={15} color="var(--accent-cyan)" />
              Kontak & Catatan Touch-Up Kolaborasi
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  No. WhatsApp Talent:
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62812xxxxxxx"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                    }}
                  />
                  {phone && (
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.75rem',
                        background: '#25D366',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Phone size={13} />
                      <span>Chat WA</span>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Email Manajemen / Business:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mgmt.creator@gmail.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                Catatan Internal / Rate Card & Brief Kolaborasi:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tulis catatan gaya konten, rate card estimasi, atau hasil diskusi..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 10,
          padding: '14px 22px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.82rem' }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
