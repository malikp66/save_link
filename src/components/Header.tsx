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
  RotateCcw
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface HeaderProps {
  activeTab: 'feed' | 'analytics' | 'crm';
  setActiveTab: (tab: 'feed' | 'analytics' | 'crm') => void;
  onOpenAddModal: () => void;
  onOpenBulkModal: () => void;
  onOpenCategoryModal: () => void;
  onResetToRealData?: () => void;
  totalLinksCount: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenBulkModal,
  onOpenCategoryModal,
  onResetToRealData,
  totalLinksCount,
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Logo & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            }}>
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 800, 
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  TalentPulse
                </h1>
                <span className="badge" style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  fontSize: '0.7rem'
                }}>
                  PWA
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                IG & TikTok Content Analyzer & Talent CRM
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Database indicator */}
            <div 
              title={isSupabaseConfigured ? "Terhubung ke Supabase Cloud DB" : "Penyimpanan Local-First (Offline Ready)"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: isSupabaseConfigured ? '#34d399' : '#fbbf24',
                border: `1px solid ${isSupabaseConfigured ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              }}
            >
              <Database size={13} />
              <span>{isSupabaseConfigured ? 'Cloud Sync' : 'Local-First'}</span>
            </div>

            <button
              onClick={onOpenCategoryModal}
              className="btn-secondary"
              id="btn-open-category"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            >
              <Tag size={15} />
              <span>Kategori</span>
            </button>

            <button
              onClick={onOpenBulkModal}
              className="btn-secondary"
              id="btn-open-bulk"
              style={{ padding: '8px 14px', fontSize: '0.8rem', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#22d3ee' }}
            >
              <FileText size={15} />
              <span>Import dari Notes</span>
            </button>

            {onResetToRealData && (
              <button
                onClick={onResetToRealData}
                className="btn-secondary"
                id="btn-reset-real-data"
                title="Muat 176 link hasil kurasi notes Anda"
                style={{ 
                  padding: '8px 12px', 
                  fontSize: '0.8rem', 
                  borderColor: 'rgba(236, 72, 153, 0.4)', 
                  color: '#f472b6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <RotateCcw size={14} />
                <span>Muat 176 Link Notes</span>
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="btn-primary"
              id="btn-open-add"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Plus size={16} />
              <span>Simpan Link</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: 14,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: 10,
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
