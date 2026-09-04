'use client';

import React, { useState } from 'react';
import { 
  SavedLink, 
  Category, 
  OutreachStatus 
} from '@/types';
import CustomSelect, { SelectOption } from './CustomSelect';
import CopyUsernameBadge from './CopyUsernameBadge';
import { useToast } from '@/context/ToastContext';
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
  Save,
  Edit3,
  Sliders,
  ChevronDown,
  ChevronUp,
  Hash,
  User,
  Image as ImageIcon
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
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: item.title || '',
    category_id: item.category_id || '',
    talent_type: item.talent_type || 'Lokal / Indo',
    hook_type: item.hook_type || 'GRWM',
    tags: (item.tags || []).join(', '),
    hashtags: (item.hashtags || []).join(', '),
    author_name: item.author_name || '',
    author_username: item.author_username || '',
    author_profile_url: item.author_profile_url || '',
    author_avatar_url: item.author_avatar_url || '',
    thumbnail_url: item.thumbnail_url || '',
    audio_title: item.audio_title || '',
    audio_author: item.audio_author || '',
    views_count: item.views_count || 0,
    likes_count: item.likes_count || 0,
    comments_count: item.comments_count || 0,
    shares_count: item.shares_count || 0,
    rating: item.rating || 0,
    outreach_status: item.outreach_status,
    contact_phone: item.contact_phone || '',
    contact_email: item.contact_email || '',
    contact_notes: item.contact_notes || '',
  });

  const [showMediaEditor, setShowMediaEditor] = useState(false);
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [previewMode, setPreviewMode] = useState<'embed' | 'photo'>('embed');

  // Recalculate engagement rate in real-time
  const calcER = (likes: number, comments: number, shares: number, views: number) => {
    if (!views || views <= 0) return 0;
    return Number((((likes + comments + shares) / views) * 100).toFixed(2));
  };

  const currentER = calcER(
    Number(formData.likes_count),
    Number(formData.comments_count),
    Number(formData.shares_count),
    Number(formData.views_count)
  );

  const categoryOptions: SelectOption[] = [
    { value: '', label: 'Tanpa Kategori (Unassigned)', color: '#94a3b8' },
    ...categories.map((c) => ({
      value: c.id,
      label: c.name,
      color: c.color,
    })),
  ];

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

    const parsedTags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const parsedHashtags = formData.hashtags
      ? formData.hashtags
          .split(',')
          .map((h) => h.trim().replace(/^#*/, '#'))
          .filter((h) => h.length > 1)
      : [];

    onSave(item.id, {
      title: formData.title,
      category_id: formData.category_id ? formData.category_id : null,
      talent_type: formData.talent_type,
      hook_type: formData.hook_type,
      tags: parsedTags,
      hashtags: parsedHashtags,
      author_name: formData.author_name.trim() || item.author_name,
      author_username: formData.author_username.trim().replace(/^@/, '') || item.author_username,
      author_profile_url: formData.author_profile_url.trim() || item.author_profile_url,
      author_avatar_url: formData.author_avatar_url.trim() || item.author_avatar_url,
      thumbnail_url: formData.thumbnail_url.trim() || item.thumbnail_url,
      audio_title: formData.audio_title.trim() || item.audio_title,
      audio_author: formData.audio_author.trim() || item.audio_author,
      views_count: Number(formData.views_count),
      likes_count: Number(formData.likes_count),
      comments_count: Number(formData.comments_count),
      shares_count: Number(formData.shares_count),
      engagement_rate: er,
      rating: formData.rating,
      outreach_status: formData.outreach_status,
      contact_phone: formData.contact_phone.trim(),
      contact_email: formData.contact_email.trim(),
      contact_notes: formData.contact_notes.trim(),
    });

    showToast('Perubahan konten berhasil disimpan!', 'success');
    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
      onClose();
    }, 450);
  };

  // WhatsApp touch-up greeting generator
  const generateWhatsAppLink = () => {
    if (!formData.contact_phone) return '#';
    const cleanPhone = formData.contact_phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const authorName = formData.author_name || item.author_name;
    const titleSnippet = (formData.title || item.title).slice(0, 50);
    const greeting = encodeURIComponent(
      `Halo kak ${authorName}! Aku lihat konten kakak "${titleSnippet}..." di ${item.platform === 'tiktok' ? 'TikTok' : 'Instagram'} keren banget dan cocok banget dengan audiens kami. Apakah saat ini open untuk endorsement/kolaborasi campaign? Ditunggu kabar baiknya ya kak!`
    );
    return `https://wa.me/${phoneWithCountry}?text=${greeting}`;
  };

  const currentAvatar = formData.author_avatar_url || item.author_avatar_url;
  const currentThumbnail = formData.thumbnail_url || item.thumbnail_url;
  const currentAuthorName = formData.author_name || item.author_name;
  const currentUsername = formData.author_username || item.author_username;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 860, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(20, 24, 39, 0.65)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`badge ${item.platform === 'tiktok' ? 'badge-tiktok' : 'badge-ig'}`}>
              {item.platform === 'tiktok' ? 'TikTok Video' : 'Instagram Reel'}
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Edit3 size={16} color="var(--accent-cyan)" />
              Edit Konten & Analisis Outreach
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
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="detail-modal-grid">
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
                    <span>🎬 Live Player</span>
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
                    <span>🖼️ Cover Photo</span>
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
                  item.media_type === 'profile' ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '36px 20px',
                      background: 'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.15), transparent 70%), #0e111a',
                      gap: 16,
                      textAlign: 'center',
                    }}>
                      <div style={{
                        position: 'relative',
                        width: 110,
                        height: 110,
                        borderRadius: '50%',
                        padding: 3,
                        background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                        boxShadow: '0 8px 30px rgba(220, 39, 67, 0.35)',
                      }}>
                        <img
                          src={currentAvatar || currentThumbnail}
                          alt={currentAuthorName}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            const target = currentAvatar || currentThumbnail;
                            if (!img.src.includes('/api/proxy-image') && target && target.startsWith('http')) {
                              img.src = `/api/proxy-image?url=${encodeURIComponent(target)}`;
                            } else {
                              img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';
                            }
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            background: '#131728',
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                            {currentAuthorName || currentUsername}
                          </h3>
                          <span style={{ color: '#06b6d4', fontSize: '1rem' }}>✓</span>
                        </div>
                        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
                          <CopyUsernameBadge username={currentUsername} size="md" />
                        </div>
                      </div>

                      <a
                        href={formData.author_profile_url || item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{
                          padding: '10px 20px',
                          fontSize: '0.85rem',
                          background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 6,
                          boxShadow: '0 4px 20px rgba(220, 39, 67, 0.4)',
                        }}
                      >
                        <ExternalLink size={16} />
                        <span>Buka Profil Resmi di Instagram ➔</span>
                      </a>
                    </div>
                  ) : item.platform === 'instagram' ? (
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
                        src={currentThumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'} 
                        alt={formData.title || item.title}
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
                      src={currentThumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'} 
                      alt={formData.title || item.title}
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
                      src={currentAvatar || `https://api.dicebear.com/7.x/personas/svg?seed=${currentUsername}`}
                      alt={currentAuthorName}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (!img.src.includes('/api/proxy-image') && currentAvatar && currentAvatar.startsWith('http')) {
                          img.src = `/api/proxy-image?url=${encodeURIComponent(currentAvatar)}`;
                        } else {
                          img.src = `https://api.dicebear.com/7.x/personas/svg?seed=${currentUsername}`;
                        }
                      }}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid #8b5cf6', background: '#1a1d2e', flexShrink: 0 }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>{currentAuthorName}</h4>
                      <div style={{ marginTop: 2 }}>
                        <CopyUsernameBadge username={currentUsername} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {onOpenCreatorProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenCreatorProfile(currentUsername);
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
                      href={formData.author_profile_url || item.author_profile_url || item.url}
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
                    <span style={{ fontWeight: 700, color: currentER > 9 ? '#34d399' : '#fbbf24' }}>
                      {currentER > 9 ? '🚀 Sangat Tinggi / Viral' : currentER >= 6 ? '🔥 Performa Sehat' : '👍 Standar'} ({currentER}% ER)
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
                      🎵 {formData.audio_title || item.audio_title || 'Original Audio'} {formData.audio_author ? `- ${formData.audio_author}` : ''}
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
            </div>

            {/* Right Column: In-Depth Content Editing & Outreach Management */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Section 1: Judul / Caption Konten */}
              <div className="glass-panel" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Edit3 size={14} color="#06b6d4" />
                    <span>Judul / Caption Konten:</span>
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {formData.title.length} karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Tulis judul atau ringkasan caption konten..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#0d111d',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.45,
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Section 2: Kategori Niche, Talent Type & Hook Type */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', marginBottom: 6 }}>
                    <Tag size={13} />
                    <span>Kategori Niche:</span>
                  </label>
                  <CustomSelect
                    value={formData.category_id}
                    onChange={(val) => setFormData({ ...formData, category_id: val })}
                    options={categoryOptions}
                    placeholder="Pilih Kategori"
                    size="sm"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#f472b6', marginBottom: 6 }}>
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
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
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

              {/* Section 3: Tags & Hashtags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5 }}>
                    <Tag size={12} color="#a855f7" />
                    <span>Tags Kustom (pisahkan koma):</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: skincare, aff, endorsement"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#0d111d',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.78rem',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5 }}>
                    <Hash size={12} color="#06b6d4" />
                    <span>Hashtags (pisahkan koma):</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: #racunshopee, #fyp, #ootd"
                    value={formData.hashtags}
                    onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#0d111d',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.78rem',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>
              </div>

              {/* Section 4: Outreach Status Pipeline */}
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

              {/* Section 5: Rating Bintang */}
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

              {/* Section 6: In-Depth Performance Metrics */}
              <div className="glass-panel" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TrendingUp size={15} color="#34d399" />
                    Metrik Performa & Engagement
                  </span>
                  <span className="badge badge-er">
                    ER: {currentER}%
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

              {/* Section 7: Personal Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Catatan Pribadi & Log Follow-up:
                </label>
                <textarea
                  rows={2}
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

              {/* Section 8: Detail Akun Kreator & Media (Collapsible Accordion) */}
              <div className="glass-panel" style={{ padding: 12, borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  onClick={() => setShowMediaEditor(!showMediaEditor)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '2px 4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sliders size={14} color="#f472b6" />
                    <span>⚙️ Edit Detail Akun Kreator & URL Media</span>
                  </div>
                  {showMediaEditor ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showMediaEditor && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          Nama Kreator (Display Name):
                        </label>
                        <input
                          type="text"
                          value={formData.author_name}
                          onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          Username (@username):
                        </label>
                        <input
                          type="text"
                          value={formData.author_username}
                          onChange={(e) => setFormData({ ...formData, author_username: e.target.value.replace(/^@/, '') })}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                        URL Profil Kreator:
                      </label>
                      <input
                        type="text"
                        value={formData.author_profile_url}
                        onChange={(e) => setFormData({ ...formData, author_profile_url: e.target.value })}
                        placeholder="https://instagram.com/..."
                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          URL Cover / Thumbnail:
                        </label>
                        <input
                          type="text"
                          value={formData.thumbnail_url}
                          onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                          placeholder="https://..."
                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          URL Avatar Foto Profil:
                        </label>
                        <input
                          type="text"
                          value={formData.author_avatar_url}
                          onChange={(e) => setFormData({ ...formData, author_avatar_url: e.target.value })}
                          placeholder="https://..."
                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          Judul Audio / Musik:
                        </label>
                        <input
                          type="text"
                          value={formData.audio_title}
                          onChange={(e) => setFormData({ ...formData, audio_title: e.target.value })}
                          placeholder="Original Sound"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          Artis / Pembuat Audio:
                        </label>
                        <input
                          type="text"
                          value={formData.audio_author}
                          onChange={(e) => setFormData({ ...formData, audio_author: e.target.value })}
                          placeholder="Nama Artis"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: 6, background: '#0e111a', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 20px',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
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
