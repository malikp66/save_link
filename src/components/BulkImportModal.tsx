'use client';

import React, { useState } from 'react';
import { Category, SavedLink } from '@/types';
import { extractUrlsFromNotes, detectPlatform } from '@/lib/linkParser';
import CustomSelect from './CustomSelect';
import { X, FileText, Loader2, CheckCircle2, Sparkles, Layers } from 'lucide-react';

interface BulkImportModalProps {
  categories: Category[];
  onClose: () => void;
  onImportComplete: (newLinks: SavedLink[]) => void;
}

export default function BulkImportModal({
  categories,
  onClose,
  onImportComplete,
}: BulkImportModalProps) {
  const [notesText, setNotesText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  // Real-time extracted links
  const extractedUrls = extractUrlsFromNotes(notesText);
  const igCount = extractedUrls.filter((u) => detectPlatform(u) === 'instagram').length;
  const tiktokCount = extractedUrls.filter((u) => detectPlatform(u) === 'tiktok').length;

  const handleStartImport = async () => {
    if (extractedUrls.length === 0) return;
    setIsProcessing(true);
    setProgress({ current: 0, total: extractedUrls.length });
    setErrorLogs([]);

    const createdItems: SavedLink[] = [];

    for (let i = 0; i < extractedUrls.length; i++) {
      const url = extractedUrls[i];
      try {
        const res = await fetch('/api/parse-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        if (res.ok) {
          const parsed = await res.json();
          const views = parsed.views_count || 120000;
          const likes = parsed.likes_count || 14000;
          const comments = parsed.comments_count || 320;
          const shares = parsed.shares_count || 450;
          const er = Number((((likes + comments + shares) / views) * 100).toFixed(2));

          const newLink: SavedLink = {
            id: `link-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
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
            rating: 4,
            category_id: selectedCategory || null,
            tags: parsed.hashtags?.slice(0, 3) || ['Imported Notes'],
            hook_type: 'GRWM',
            outreach_status: 'saved',
            contact_notes: 'Diimport langsung dari Notes',
            last_contacted_at: null,
            created_at: new Date().toISOString(),
          };

          createdItems.push(newLink);
        } else {
          setErrorLogs((prev) => [...prev, `Gagal import: ${url}`]);
        }
      } catch (err: any) {
        setErrorLogs((prev) => [...prev, `Error: ${url}`]);
      }

      setProgress({ current: i + 1, total: extractedUrls.length });
    }

    setIsProcessing(false);
    if (createdItems.length > 0) {
      onImportComplete(createdItems);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680 }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Migrasi & Import Link dari Notes</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Paste seluruh teks catatan Anda. Sistem akan otomatis mendeteksi link IG & TikTok.
              </p>
            </div>
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

        {/* Body */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Textarea */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              Paste Isi Notes Anda di Sini:
            </label>
            <textarea
              rows={8}
              placeholder={`Contoh isi Notes:\n- https://www.instagram.com/reel/C3x9a1BpQqR/\n- konten bagus https://vt.tiktok.com/ZS2...\n- nadya ootd https://www.tiktok.com/@nadya_arista/video/...`}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Detection Stats Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Ditemukan</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {extractedUrls.length} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>link</span>
                </p>
              </div>
              <div style={{ width: 1, height: 28, background: 'var(--border-subtle)' }} />
              <div>
                <span style={{ fontSize: '0.72rem', color: '#fb7185' }}>Instagram</span>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fb7185' }}>{igCount}</p>
              </div>
              <div style={{ width: 1, height: 28, background: 'var(--border-subtle)' }} />
              <div>
                <span style={{ fontSize: '0.72rem', color: '#22d3ee' }}>TikTok</span>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#22d3ee' }}>{tiktokCount}</p>
              </div>
            </div>

            {/* Category Selector for bulk */}
            <div style={{ minWidth: 160 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Tetapkan Kategori:
              </span>
              <CustomSelect
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                options={categories.map((c) => ({ value: c.id, label: c.name, color: c.color }))}
                size="sm"
              />
            </div>
          </div>

          {/* Processing Progress Bar */}
          {isProcessing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22d3ee' }}>
                  <Loader2 size={14} className="animate-spin" />
                  Mengambil metadata & preview...
                </span>
                <span style={{ fontWeight: 700 }}>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(progress.current / Math.max(progress.total, 1)) * 100}%`,
                  background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
                  transition: 'width 0.2s ease',
                }} />
              </div>
            </div>
          )}

          {/* Footer Actions */}
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
              disabled={isProcessing}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleStartImport}
              disabled={extractedUrls.length === 0 || isProcessing}
              className="btn-primary"
              id="btn-confirm-bulk-import"
              style={{
                opacity: extractedUrls.length === 0 || isProcessing ? 0.5 : 1,
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              }}
            >
              <Sparkles size={16} />
              <span>
                {isProcessing
                  ? `Memproses (${progress.current}/${progress.total})...`
                  : `Mulai Import ${extractedUrls.length} Link`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
