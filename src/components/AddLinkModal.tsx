'use client';

import React, { useState } from 'react';
import { Category, SavedLink, OutreachStatus, ParsedLinkData } from '@/types';
import CustomSelect, { SelectOption } from './CustomSelect';
import { X, Link2, Loader2, Sparkles, Plus, Star } from 'lucide-react';

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
];

const ADD_OUTREACH_OPTIONS: SelectOption[] = [
  { value: 'saved', label: 'Simpan Saja', icon: '📥' },
  { value: 'shortlisted', label: 'Masuk Shortlist', icon: '⭐', color: '#fbbf24' },
  { value: 'contacted', label: 'Sudah Di-DM', icon: '💬', color: '#c084fc' },
];

interface AddLinkModalProps {
  categories: Category[];
  onClose: () => void;
  onAdd: (linkData: Omit<SavedLink, 'id' | 'created_at' | 'updated_at'>) => void;
}

export default function AddLinkModal({
  categories,
  onClose,
  onAdd,
}: AddLinkModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [parsed, setParsed] = useState<ParsedLinkData | null>(null);

  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [talentType, setTalentType] = useState('Chindo');
  const [outreachStatus, setOutreachStatus] = useState<OutreachStatus>('saved');
  const [rating, setRating] = useState(4);
  const [hookType, setHookType] = useState('GRWM');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNotes, setContactNotes] = useState('');

  const handleFetchPreview = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/parse-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengambil info link');
      }

      setParsed(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed) return;

    const views = parsed.views_count || 100000;
    const likes = parsed.likes_count || 12000;
    const comments = parsed.comments_count || 300;
    const shares = parsed.shares_count || 450;
    const er = Number((((likes + comments + shares) / views) * 100).toFixed(2));

    onAdd({
      platform: parsed.platform,
      url: parsed.url,
      media_type: parsed.media_type,
      author_username: parsed.author_username,
      author_name: parsed.author_name,
      author_avatar_url: parsed.author_avatar_url,
      author_profile_url: parsed.author_profile_url,
      title: parsed.title,
      thumbnail_url: parsed.thumbnail_url,
      embed_html: parsed.embed_html,
      audio_title: parsed.audio_title,
      audio_author: parsed.audio_author,
      hashtags: parsed.hashtags || [],
      views_count: views,
      likes_count: likes,
      comments_count: comments,
      shares_count: shares,
      engagement_rate: er,
      rating,
      category_id: selectedCategory || null,
      talent_type: talentType,
      tags: [talentType, ...(parsed.hashtags?.slice(0, 2) || [])],
      hook_type: hookType,
      outreach_status: outreachStatus,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      contact_notes: contactNotes,
      last_contacted_at: null,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link2 size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Simpan Link Konten Baru</h3>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* URL Input & Fetch */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              Paste URL Instagram Reel atau TikTok Video:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="url"
                required
                placeholder="https://www.instagram.com/reel/... atau https://vt.tiktok.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                }}
              />
              <button
                type="button"
                onClick={handleFetchPreview}
                disabled={loading || !url.trim()}
                className="btn-primary"
                id="btn-fetch-preview"
                style={{
                  padding: '10px 16px',
                  fontSize: '0.82rem',
                  opacity: loading || !url.trim() ? 0.6 : 1,
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{loading ? 'Mengambil...' : 'Preview'}</span>
              </button>
            </div>
            {errorMsg && (
              <p style={{ color: '#f43f5e', fontSize: '0.78rem', marginTop: 6 }}>
                ⚠️ {errorMsg}
              </p>
            )}
          </div>

          {/* Parsed Preview Card */}
          {parsed && (
            <div className="glass-panel" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
              <img 
                src={parsed.thumbnail_url} 
                alt={parsed.title}
                style={{ width: 80, height: 100, borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
                <span className={`badge ${parsed.platform === 'tiktok' ? 'badge-tiktok' : 'badge-ig'}`} style={{ alignSelf: 'flex-start' }}>
                  {parsed.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={parsed.author_avatar_url} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>@{parsed.author_username}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {parsed.title}
                </p>
              </div>
            </div>
          )}

          {/* Form Options (Category, Talent Type, Hook) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Kategori Niche:
              </label>
              <CustomSelect
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                options={categories.map((c) => ({ value: c.id, label: c.name, color: c.color }))}
                placeholder="Pilih Kategori"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#f472b6', marginBottom: 6 }}>
                Tipe / Persona Cewe:
              </label>
              <CustomSelect
                value={talentType}
                onChange={(val) => setTalentType(val)}
                options={TALENT_TYPE_OPTIONS}
                placeholder="Pilih Tipe Cewe"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Format / Hook:
              </label>
              <CustomSelect
                value={hookType}
                onChange={(val) => setHookType(val)}
                options={HOOK_TYPE_OPTIONS}
                placeholder="Pilih Hook"
              />
            </div>
          </div>

          {/* Rating & Outreach Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Rating Ketertarikan:
              </label>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 40 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ padding: 2 }}
                  >
                    <Star 
                      size={20} 
                      fill={star <= rating ? '#fbbf24' : 'none'} 
                      color={star <= rating ? '#fbbf24' : 'var(--text-dim)'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Status Outreach:
              </label>
              <CustomSelect
                value={outreachStatus}
                onChange={(val) => setOutreachStatus(val as OutreachStatus)}
                options={ADD_OUTREACH_OPTIONS}
              />
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Nomor WA (Opsional):
              </label>
              <input
                type="text"
                placeholder="+62..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Email (Opsional):
              </label>
              <input
                type="email"
                placeholder="collab@..."
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              Catatan / Alasan Menyimpan:
            </label>
            <input
              type="text"
              placeholder="Contoh: Sangat estetik, cocok untuk launching produk X..."
              value={contactNotes}
              onChange={(e) => setContactNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
              }}
            />
          </div>

          {/* Submit */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            paddingTop: 10,
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!parsed}
              className="btn-primary"
              id="btn-confirm-save-link"
              style={{ opacity: !parsed ? 0.5 : 1 }}
            >
              <Plus size={16} />
              <span>Simpan ke Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
