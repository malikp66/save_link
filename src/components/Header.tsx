'use client';

import React from 'react';
import { 
  Sparkles, 
  Plus, 
  FileText, 
  Tag, 
  BarChart3, 
  Users2, 
  LayoutGrid, 
  Database,
  Smartphone,
  RotateCcw,
  Lock
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface HeaderProps {
  activeTab: 'feed' | 'profiles' | 'analytics' | 'crm';
  setActiveTab: (tab: 'feed' | 'profiles' | 'analytics' | 'crm') => void;
  onOpenAddModal: () => void;
  onOpenBulkModal: () => void;
  onOpenCategoryModal: () => void;
  onResetToRealData?: () => void;
  onLogout?: () => void;
  totalLinksCount: number;
  totalProfilesCount?: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenBulkModal,
  onOpenCategoryModal,
  onResetToRealData,
  onLogout,
  totalLinksCount,
  totalProfilesCount,
}: HeaderProps) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 11, 18, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 0',
    }}>
      <div className="app-container" style={{ paddingBottom: 0, paddingTop: 0 }}>
        {/* Top bar: Brand & Main CTA buttons */}
        <div className="header-top-bar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          {/* Logo & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
              flexShrink: 0,
            }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h1 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 800, 
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0,
                }}>
                  TalentPulse
                </h1>
                <span className="badge" style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                }}>
                  PWA
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                IG & TikTok Intelligence & CRM
              </p>
            </div>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Database indicator */}
            <div 
              title={isSupabaseConfigured ? "Terhubung ke Supabase Cloud DB" : "Penyimpanan Local-First (Offline Ready)"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: isSupabaseConfigured ? '#34d399' : '#fbbf24',
                border: `1px solid ${isSupabaseConfigured ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              }}
            >
              <Database size={13} />
              <span className="desktop-only">{isSupabaseConfigured ? 'Cloud Sync' : 'Local-First'}</span>
            </div>

            <button
              onClick={onOpenCategoryModal}
              className="btn-secondary"
              id="btn-open-category"
              title="Kelola Kategori"
              style={{ padding: '7px 10px', fontSize: '0.78rem' }}
            >
              <Tag size={14} />
              <span className="desktop-only">Kategori</span>
            </button>

            <button
              onClick={onOpenBulkModal}
              className="btn-secondary"
              id="btn-open-bulk"
              title="Import dari Notes"
              style={{ padding: '7px 10px', fontSize: '0.78rem', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#22d3ee' }}
            >
              <FileText size={14} />
              <span className="desktop-only">Import</span>
            </button>

            {onResetToRealData && (
              <button
                onClick={onResetToRealData}
                className="btn-secondary"
                id="btn-reset-real-data"
                title="Muat 176 link hasil kurasi notes Anda"
                style={{ 
                  padding: '7px 10px', 
                  fontSize: '0.78rem', 
                  borderColor: 'rgba(236, 72, 153, 0.4)', 
                  color: '#f472b6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <RotateCcw size={14} />
                <span className="desktop-only">176 Link</span>
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="btn-primary"
              id="btn-open-add"
              title="Simpan Link Baru"
              style={{ padding: '7px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Plus size={15} />
              <span>Simpan</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="btn-secondary"
                id="btn-lock-app"
                title="Kunci Aplikasi / Logout"
                style={{
                  padding: '7px 10px',
                  fontSize: '0.78rem',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Lock size={14} />
                <span className="desktop-only">Kunci</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="header-tabs" style={{
          display: 'flex',
          gap: 8,
          marginTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: 8,
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setActiveTab('feed')}
            id="tab-feed"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'feed' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: activeTab === 'feed' ? '#c084fc' : 'var(--text-muted)',
              border: activeTab === 'feed' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <LayoutGrid size={16} />
            <span>Feed & Kurasi</span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1px 6px',
              borderRadius: 10,
              fontSize: '0.72rem',
            }}>
              {totalLinksCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            id="tab-profiles"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'profiles' ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
              color: activeTab === 'profiles' ? '#f472b6' : 'var(--text-muted)',
              border: activeTab === 'profiles' ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <Users2 size={16} />
            <span>Profil Akun & Talent</span>
            {totalProfilesCount !== undefined && (
              <span style={{
                background: 'rgba(236, 72, 153, 0.2)',
                color: '#f472b6',
                padding: '1px 6px',
                borderRadius: 10,
                fontSize: '0.72rem',
                fontWeight: 700,
              }}>
                {totalProfilesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            id="tab-analytics"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'analytics' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              color: activeTab === 'analytics' ? '#38bdf8' : 'var(--text-muted)',
              border: activeTab === 'analytics' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <BarChart3 size={16} />
            <span>Analisis & Tren</span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            id="tab-crm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'crm' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: activeTab === 'crm' ? '#fbbf24' : 'var(--text-muted)',
              border: activeTab === 'crm' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <Users2 size={16} />
            <span>Talent Outreach CRM</span>
          </button>
        </div>
      </div>
    </header>
  );
}
