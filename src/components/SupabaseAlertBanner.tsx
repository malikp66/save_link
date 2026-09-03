'use client';

import React, { useState } from 'react';
import { SupabaseStatusResult } from '@/lib/db';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  ExternalLink, 
  X, 
  RefreshCw,
  Terminal
} from 'lucide-react';

interface SupabaseAlertBannerProps {
  status: SupabaseStatusResult | null;
  onRefresh: () => void;
}

export default function SupabaseAlertBanner({ status, onRefresh }: SupabaseAlertBannerProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRetesting, setIsRetesting] = useState(false);

  if (!status) return null;

  const handleCopySQL = async () => {
    try {
      const sqlText = `-- Jalankan query ini di Supabase Dashboard > SQL Editor > New Query
create extension if not exists "uuid-ossp";

create table if not exists categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    color text not null default '#8b5cf6',
    icon text not null default 'tag',
    is_system boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists saved_links (
    id uuid primary key default gen_random_uuid(),
    platform text not null check (platform in ('instagram', 'tiktok')),
    url text not null,
    media_type text not null default 'reel',
    author_username text,
    author_name text,
    author_avatar_url text,
    author_profile_url text,
    title text,
    thumbnail_url text,
    embed_html text,
    audio_title text,
    audio_author text,
    hashtags text[] default '{}',
    views_count bigint default 0,
    likes_count bigint default 0,
    comments_count bigint default 0,
    shares_count bigint default 0,
    engagement_rate numeric(8, 2) default 0.00,
    rating int default 0 check (rating between 0 and 5),
    category_id uuid references categories(id) on delete set null,
    talent_type text,
    tags text[] default '{}',
    hook_type text,
    outreach_status text not null default 'saved' check (
        outreach_status in ('saved', 'shortlisted', 'contacted', 'in_discussion', 'collaborated', 'archived')
    ),
    contact_phone text,
    contact_email text,
    contact_notes text,
    last_contacted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table categories enable row level security;
alter table saved_links enable row level security;

create policy "Allow all operations for anon categories" on categories for all using (true) with check (true);
create policy "Allow all operations for anon saved_links" on saved_links for all using (true) with check (true);

insert into categories (name, slug, color, icon, is_system) values
    ('Chindo', 'chindo', '#ec4899', 'sparkles', true),
    ('Lokal / Indo', 'lokal-indo', '#f59e0b', 'smile', true),
    ('Hijab / Muslimah', 'hijab-muslimah', '#10b981', 'heart', true),
    ('Fienshyt / Edgy', 'fienshyt-edgy', '#8b5cf6', 'flame', true),
    ('Bocil / Remaja', 'bocil-remaja', '#06b6d4', 'star', true),
    ('Fashion & OOTD', 'fashion-ootd', '#ec4899', 'shirt', true),
    ('Beauty & Skincare', 'beauty-skincare', '#f43f5e', 'sparkles', true),
    ('Dance & Trends', 'dance-trends', '#a855f7', 'music', true),
    ('Lifestyle & Vlog', 'lifestyle-vlog', '#06b6d4', 'camera', true)
on conflict (slug) do nothing;`;

      await navigator.clipboard.writeText(sqlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy SQL:', e);
    }
  };

  const handleTestConnection = async () => {
    setIsRetesting(true);
    await onRefresh();
    setIsRetesting(false);
  };

  // Determine banner state
  const isAllGood = status.isConnected && status.tablesExist;
  const needsMigration = status.isConnected && !status.tablesExist;

  return (
    <>
      {/* Banner Bar */}
      <div 
        onClick={() => setIsOpenModal(true)}
        style={{
          cursor: 'pointer',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          fontWeight: 600,
          background: isAllGood 
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))'
            : needsMigration
            ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))'
            : 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(30, 41, 59, 0.3))',
          borderBottom: isAllGood
            ? '1px solid rgba(16, 185, 129, 0.3)'
            : needsMigration
            ? '1px solid rgba(245, 158, 11, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.08)',
          color: isAllGood ? '#34d399' : needsMigration ? '#fbbf24' : '#cbd5e1',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAllGood ? (
            <CheckCircle2 size={16} color="#34d399" />
          ) : needsMigration ? (
            <AlertTriangle size={16} color="#fbbf24" />
          ) : (
            <Database size={16} color="#c084fc" />
          )}

          <span>
            {isAllGood && '🟢 Supabase Cloud Terhubung & Sinkronisasi Aktif'}
            {needsMigration && '🟡 Supabase Terhubung, Tapi Tabel Belum Dibuat di Supabase SQL Editor'}
            {!status.isConfigured && '🟠 Mode Penyimpanan Lokal (Local Storage Browser)'}
          </span>
        </div>

        <span style={{
          fontSize: '0.72rem',
          textDecoration: 'underline',
          opacity: 0.9,
        }}>
          {needsMigration ? 'Klik untuk panduan 1-klik buat tabel ➔' : 'Lihat Status Konek ➔'}
        </span>
      </div>

      {/* Connection Diagnostic Modal */}
      {isOpenModal && (
        <div className="modal-overlay" onClick={() => setIsOpenModal(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 620 }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Database size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Status Koneksi Database</h3>
              </div>

              <button
                onClick={() => setIsOpenModal(false)}
                style={{ padding: 6, color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Status Box */}
              <div style={{
                padding: 14,
                borderRadius: 'var(--radius-md)',
                background: isAllGood ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${isAllGood ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                {isAllGood ? (
                  <CheckCircle2 size={22} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <AlertTriangle size={22} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: isAllGood ? '#34d399' : '#fbbf24' }}>
                    {isAllGood ? 'Supabase Siap Digunakan!' : needsMigration ? 'Kredensial Valid, Tabel Belum Dibuat' : 'Penyimpanan Lokal'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: 4, lineHeight: 1.5 }}>
                    {status.message}
                  </p>
                </div>
              </div>

              {/* URL & Credential Preview */}
              {status.projectUrl && (
                <div style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Supabase Project URL:</span>
                  <code style={{ color: '#22d3ee', fontFamily: 'monospace' }}>{status.projectUrl}</code>
                </div>
              )}

              {/* Action for Creating Tables */}
              {needsMigration && (
                <div className="glass-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b' }}>
                    <Terminal size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Langkah Membuat Tabel (Hanya 1 Menit):</span>
                  </div>

                  <ol style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: 18, lineHeight: 1.6 }}>
                    <li>Klik tombol <b>"Salin Skrip SQL"</b> di bawah ini.</li>
                    <li>Buka <a href="https://supabase.com/dashboard/project/ylngelyodflttfyyrkwr/sql" target="_blank" rel="noreferrer" style={{ color: '#22d3ee', textDecoration: 'underline' }}>Supabase SQL Editor (klik di sini)</a>.</li>
                    <li>Klik <b>"New Query"</b>, paste skrip tadi, lalu klik tombol hijau <b>"Run"</b>.</li>
                    <li>Kembali ke sini dan tekan tombol <b>"Tes Ulang Koneksi"</b>!</li>
                  </ol>

                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      onClick={handleCopySQL}
                      className="btn-primary"
                      style={{ flex: 1, padding: '9px 14px', fontSize: '0.82rem' }}
                    >
                      <Copy size={15} />
                      <span>{copied ? 'Berhasil Disalin ke Clipboard!' : 'Salin Skrip SQL Schema'}</span>
                    </button>

                    <a
                      href="https://supabase.com/dashboard/project/ylngelyodflttfyyrkwr/sql"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ padding: '9px 14px', fontSize: '0.82rem' }}
                    >
                      <ExternalLink size={15} />
                      <span>Buka SQL Editor</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: '1px solid var(--border-subtle)',
              }}>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isRetesting}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  <RefreshCw size={14} className={isRetesting ? 'animate-spin' : ''} />
                  <span>{isRetesting ? 'Mengecek...' : 'Tes Ulang Koneksi'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="btn-primary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
