'use client';

import React, { useState } from 'react';
import { 
  SavedLink, 
  Category, 
  OutreachStatus 
} from '@/types';
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
  Music, 
  Tag, 
  Clock,
  Save
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TALENT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Chindo', label: 'Chindo', color: '#f472b6' },
  { value: 'Lokal / Indo', label: 'Lokal / Indo', color: '#f59e0b' },
  { value: 'Hijab / Muslimah', label: 'Hijab / Muslimah', color: '#10b981' },
  { value: 'Fienshyt / Edgy', label: 'Fienshyt / Edgy', color: '#a855f7' },
  { value: 'Bocil / Remaja', label: 'Bocil / Remaja', color: '#06b6d4' },
  { value: 'Bule / Blasteran', label: 'Bule / Blasteran' },
  { value: 'Korean Look', label: 'Korean Look' },
  { value: 'Lainnya', label: 'Lainnya' },
];

const HOOK_TYPE_OPTIONS: SelectOption[] = [
  { value: 'GRWM', label: 'GRWM' },
  { value: 'Haul & Try-On', label: 'Haul & Try-On' },
  { value: 'A Day in Life', label: 'A Day in Life' },
  { value: 'Dance / Trend', label: 'Dance / Trend' },
  { value: 'Tutorial / Tips', label: 'Tutorial' },
  { value: 'POV & Comedy', label: 'POV / Comedy' },
  { value: 'Aesthetic Vibe', label: 'Aesthetic' },
];

interface ContentDetailModalProps {
  item: SavedLink;
  categories: Category[];
  onClose: () => void;
  onSave: (id: string, updates: Partial<SavedLink>) => void;
  onDelete: (id: string) => void;
  onOpenCreatorProfile?: (username: string) => void;
}

export default function ContentDetailModal({
  item,
  categories,
  onClose,
  onSave,
  onDelete,
  onOpenCreatorProfile,
}: ContentDetailModalProps) {
  const [formData, setFormData] = useState({
    title: item.title || '',
    category_id: item.category_id || '',
    talent_type: item.talent_type || 'Lokal / Indo',
    outreach_status: item.outreach_status,
    rating: item.rating || 0,
    hook_type: item.hook_type || 'GRWM',
    views_count: item.views_count || 0,
    likes_count: item.likes_count || 0,
    comments_count: item.comments_count || 0,
    shares_count: item.shares_count || 0,
    contact_phone: item.contact_phone || '',
    contact_email: item.contact_email || '',
    contact_notes: item.contact_notes || '',
  });

  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [previewMode, setPreviewMode] = useState<'embed' | 'photo'>('embed');

  // Recalculate engagement rate
  const calcER = (likes: number, comments: number, shares: number, views: number) => {
    if (!views || views <= 0) return 0;
    return Number((((likes + comments + shares) / views) * 100).toFixed(2));
  };

  const handleStatusChange = (newStatus: OutreachStatus) => {
    setFormData((prev) => ({ ...prev, outreach_status: newStatus }));
    if (newStatus === 'collaborated') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const er = calcER(
      Number(formData.likes_count),
      Number(formData.comments_count),
      Number(formData.shares_count),
      Number(formData.views_count)
    );

    onSave(item.id, {
      ...formData,
      views_count: Number(formData.views_count),
      likes_count: Number(formData.likes_count),
      comments_count: Number(formData.comments_count),
      shares_count: Number(formData.shares_count),
      engagement_rate: er,
    });

    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
      onClose();
    }, 600);
  };

  // WhatsApp touch-up greeting generator
  const generateWhatsAppLink = () => {
    if (!formData.contact_phone) return '#';
    const cleanPhone = formData.contact_phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const greeting = encodeURIComponent(
      `Halo kak ${item.author_name}! Aku lihat konten kakak "${item.title.slice(0, 50)}..." di ${item.platform === 'tiktok' ? 'TikTok' : 'Instagram'} keren banget dan cocok banget dengan audiens kami. Apakah saat ini open untuk endorsement/kolaborasi campaign? Ditunggu kabar baiknya ya kak!`
    );
    return `https://wa.me/${phoneWithCountry}?text=${greeting}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 820, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(20, 24, 39, 0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`badge ${item.platform === 'tiktok' ? 'badge-tiktok' : 'badge-ig'}`}>
              {item.platform === 'tiktok' ? 'TikTok Video' : 'Instagram Reel'}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Analisis & Outreach Detail
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {/* Left Column: Visual Media & Creator Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Live Preview Switcher Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('embed')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      background: previewMode === 'embed' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: previewMode === 'embed' ? '#c084fc' : 'var(--text-muted)',
                      border: previewMode === 'embed' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>🎬 Live Video Player</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('photo')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      background: previewMode === 'photo' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: previewMode === 'photo' ? '#c084fc' : 'var(--text-muted)',
                      border: previewMode === 'photo' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>🖼️ Foto Thumbnail</span>
                  </button>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Buka di {item.platform}</span>
                </a>
              </div>

              {/* Media Preview / Embed Player */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#0a0d18',
                border: '1px solid var(--border-subtle)',
                minHeight: 280,
              }}>
                {previewMode === 'embed' ? (
                  item.platform === 'instagram' ? (
                    <iframe 
                      src={`https://www.instagram.com/p/${item.url.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/)?.[1] || ''}/embed/captioned/`}
                      style={{
                        width: '100%',
                        height: 480,
                        border: 'none',
                        background: '#0e111a',
                      }}
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, minHeight: 320, background: '#0e111a', gap: 12 }}>
                      <img 
                        src={item.thumbnail_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'} 
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';
                        }}
                        style={{ width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
                      />
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.8rem',
                          background: '#06b6d4',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <ExternalLink size={14} />
                        <span>Putar Video Lengkap di TikTok Asli ➔</span>
                      </a>
                    </div>
                  )
                ) : (
                  <div style={{ position: 'relative', width: '100%', height: 280 }}>
                    <img 
                      src={item.thumbnail_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'} 
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* PANEL TELAAH AKUN & CREATOR INTELLIGENCE */}
              <div className="glass-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingBottom: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(236, 72, 153, 0.2)',
                      color: '#f472b6',
                    }}>
                      🔍 TELAAH AKUN
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Pemilik Konten Terverifikasi
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                  }}>
                    {item.platform === 'instagram' ? 'Instagram Reel/Post' : 'TikTok Video'}
                  </span>
                </div>

                {/* Creator Header with Avatar & Details */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img 
                      src={item.author_avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${item.author_username}`}
                      alt={item.author_name}
                      referrerPolicy="no-referrer"
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid #8b5cf6' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>{item.author_name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--primary)', margin: 0 }}>@{item.author_username}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {onOpenCreatorProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenCreatorProfile(item.author_username);
                        }}
                        className="btn-secondary"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#f472b6',
                          borderColor: 'rgba(236, 72, 153, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <span>Telaah Akun Ini ➔</span>
                      </button>
                    )}
                    <a 
                      href={item.author_profile_url || item.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: '#c084fc',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Send size={13} />
                      <span>Kirim DM</span>
                    </a>
                  </div>
                </div>

                {/* In-depth content analysis highlights */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.025)',
                  fontSize: '0.74rem',
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Indeks Potensi Viral:</span>
                    <span style={{ fontWeight: 700, color: item.engagement_rate > 9 ? '#34d399' : '#fbbf24' }}>
                      {item.engagement_rate > 9 ? '🚀 Sangat Tinggi / Viral' : item.engagement_rate >= 6 ? '🔥 Performa Sehat' : '👍 Standar'} ({item.engagement_rate}% ER)
                    </span>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Format Hook / Gaya:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {formData.hook_type} ({formData.talent_type})
                    </span>
                  </div>

                  <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: 6 }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Audio / Sound:</span>
                    <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                      🎵 {item.audio_title || 'Original Audio'} - {item.audio_author || item.author_name}
                    </span>
                  </div>
                </div>

                {/* Direct Touch-Up Channels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  {/* WhatsApp Quick Touch-up */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="text"
                      placeholder="Nomor WhatsApp (+62...)"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8rem',
                      }}
                    />
                    {formData.contact_phone ? (
                      <a 
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#10b981',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Phone size={13} />
                        <span>Chat WA</span>
                      </a>
                    ) : null}
                  </div>

                  {/* Email */}
                  <input 
                    type="email"
                    placeholder="Email bisnis kreator"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>
              </div>

              {/* Audio & Hashtags */}
              {(item.audio_title || (item.hashtags && item.hashtags.length > 0)) && (
                <div className="glass-panel" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {item.audio_title && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#c084fc' }}>
                      <Music size={14} />
                      <span style={{ fontWeight: 500 }}>Sound: {item.audio_title}</span>
                    </div>
                  )}
                  {item.hashtags && item.hashtags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {item.hashtags.map((h, i) => (
                        <span key={i} style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-muted)'
                        }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: In-Depth Metrics & Management */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Outreach Status Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Status Outreach / Pipeline:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {(['saved', 'shortlisted', 'contacted', 'in_discussion', 'collaborated', 'archived'] as OutreachStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        background: formData.outreach_status === st ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: formData.outreach_status === st ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        color: formData.outreach_status === st ? '#c084fc' : 'var(--text-muted)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {st === 'saved' && '📥 Saved'}
                      {st === 'shortlisted' && '⭐ Shortlist'}
                      {st === 'contacted' && '💬 Contacted'}
                      {st === 'in_discussion' && '🤝 Discussion'}
                      {st === 'collaborated' && '🎉 Collab/Deal'}
                      {st === 'archived' && '⚪ Lewat'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category, Talent Type & Hook Type */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Kategori Niche:
                  </label>
                  <CustomSelect
                    value={formData.category_id}
                    onChange={(val) => setFormData({ ...formData, category_id: val })}
                    options={categories.map((c) => ({ value: c.id, label: c.name, color: c.color }))}
                    placeholder="Pilih Kategori"
                    size="sm"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#f472b6', marginBottom: 6 }}>
                    Tipe / Persona Cewe:
                  </label>
                  <CustomSelect
                    value={formData.talent_type}
                    onChange={(val) => setFormData({ ...formData, talent_type: val })}
                    options={TALENT_TYPE_OPTIONS}
                    placeholder="Pilih Tipe Cewe"
                    size="sm"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Format / Hook:
                  </label>
                  <CustomSelect
                    value={formData.hook_type}
                    onChange={(val) => setFormData({ ...formData, hook_type: val })}
                    options={HOOK_TYPE_OPTIONS}
                    placeholder="Pilih Hook"
                    size="sm"
                  />
                </div>
              </div>

              {/* Rating Bintang */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Rating Ketertarikan:
                </label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      style={{ padding: 4 }}
                    >
                      <Star 
                        size={22} 
                        fill={star <= formData.rating ? '#fbbf24' : 'none'} 
                        color={star <= formData.rating ? '#fbbf24' : 'var(--text-dim)'} 
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.8rem', color: '#fbbf24', marginLeft: 8, fontWeight: 700 }}>
                    {formData.rating}/5
                  </span>
                </div>
              </div>

              {/* In-Depth Performance Metrics */}
              <div className="glass-panel" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TrendingUp size={15} color="#34d399" />
                    Metrik Performa & Engagement
                  </span>
                  <span className="badge badge-er">
                    ER: {calcER(Number(formData.likes_count), Number(formData.comments_count), Number(formData.shares_count), Number(formData.views_count))}%
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Views:</span>
                    <input 
                      type="number"
                      value={formData.views_count}
                      onChange={(e) => setFormData({ ...formData, views_count: Number(e.target.value) })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Likes:</span>
                    <input 
                      type="number"
                      value={formData.likes_count}
                      onChange={(e) => setFormData({ ...formData, likes_count: Number(e.target.value) })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Comments:</span>
                    <input 
                      type="number"
                      value={formData.comments_count}
                      onChange={(e) => setFormData({ ...formData, comments_count: Number(e.target.value) })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Shares:</span>
                    <input 
                      type="number"
                      value={formData.shares_count}
                      onChange={(e) => setFormData({ ...formData, shares_count: Number(e.target.value) })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Personal Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Catatan Pribadi & Log Follow-up:
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Rate card 500k, tone konten sangat estetik, target campaign Q3..."
                  value={formData.contact_notes}
                  onChange={(e) => setFormData({ ...formData, contact_notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer / Save Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Tutup
            </button>

            <button
              type="submit"
              className="btn-primary"
              id="btn-save-content-detail"
            >
              <Save size={16} />
              <span>{isSavedAlert ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
