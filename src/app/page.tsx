'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import ContentDetailModal from '@/components/ContentDetailModal';
import AddLinkModal from '@/components/AddLinkModal';
import BulkImportModal from '@/components/BulkImportModal';
import CategoryManagerModal from '@/components/CategoryManagerModal';
import AnalyticsView from '@/components/AnalyticsView';
import OutreachCrmView from '@/components/OutreachCrmView';
import ProfilesView from '@/components/ProfilesView';
import ProfileDetailModal from '@/components/ProfileDetailModal';
import SupabaseAlertBanner from '@/components/SupabaseAlertBanner';
import CustomSelect, { SelectOption } from '@/components/CustomSelect';
import LoginPage from '@/components/LoginPage';
import { aggregateCreatorProfiles } from '@/lib/profileAggregator';
import { 
  SavedLink, 
  Category, 
  OutreachStatus, 
  Platform,
  CreatorProfile
} from '@/types';

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Semua Status CRM' },
  { value: 'saved', label: 'Tersimpan', icon: '📥' },
  { value: 'shortlisted', label: 'Tertarik', icon: '⭐' },
  { value: 'contacted', label: 'Sudah di-DM', icon: '💬' },
  { value: 'in_discussion', label: 'Sedang Diskusi', icon: '🤝' },
  { value: 'collaborated', label: 'Deal / Collab', icon: '🎉' },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: 'newest', label: 'Terbaru Ditambahkan' },
  { value: 'highest_er', label: 'ER Tertinggi' },
  { value: 'highest_views', label: 'Views Tertinggi' },
  { value: 'rating', label: 'Rating Tertinggi' },
];
import { 
  fetchCategories, 
  createCategory, 
  deleteCategory,
  fetchSavedLinks, 
  createSavedLink, 
  updateSavedLink, 
  deleteSavedLink,
  updateOutreachStatus,
  checkSupabaseStatus,
  SupabaseStatusResult,
  TALENT_TYPES,
  resetToRealUserLinks
} from '@/lib/db';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Plus, 
  FileText, 
  Sparkles,
  Inbox
} from 'lucide-react';

export default function Home() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check stored auth on mount
  useEffect(() => {
    const stored = localStorage.getItem('talentpulse_auth') || sessionStorage.getItem('talentpulse_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.username === 'mafiaBos') {
          setIsAuthenticated(true);
        }
      } catch {}
    }
    setAuthChecked(true);
  }, []);

  const handleLoginSuccess = (username: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('talentpulse_auth');
    sessionStorage.removeItem('talentpulse_auth');
    setIsAuthenticated(false);
  };

  const [links, setLinks] = useState<SavedLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatusResult | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'feed' | 'profiles' | 'analytics' | 'crm'>('feed');

  // Creator Profiles
  const [selectedProfile, setSelectedProfile] = useState<CreatorProfile | null>(null);

  const creatorProfiles = useMemo(() => {
    return aggregateCreatorProfiles(links);
  }, [links]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | Platform>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [talentTypeFilter, setTalentTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest_er' | 'highest_views' | 'rating'>('newest');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<SavedLink | null>(null);

  // Initial load
  const checkStatus = async () => {
    try {
      const res = await checkSupabaseStatus();
      setSupabaseStatus(res);
    } catch (e) {
      console.error('Error checking supabase status:', e);
    }
  };

  const loadData = async () => {
    try {
      const [cats, lks] = await Promise.all([
        fetchCategories(),
        fetchSavedLinks(),
      ]);
      setCategories(cats);
      setLinks(lks);
      await checkStatus();
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleAddLink = async (newLinkData: Omit<SavedLink, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await createSavedLink(newLinkData);
    setLinks((prev) => [created, ...prev]);
  };

  const handleBulkImportComplete = (newLinks: SavedLink[]) => {
    setLinks((prev) => [...newLinks, ...prev]);
  };

  const handleUpdateLink = async (id: string, updates: Partial<SavedLink>) => {
    const updated = await updateSavedLink(id, updates);
    if (updated) {
      setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
    }
  };

  const handleUpdateStatus = async (id: string, status: OutreachStatus) => {
    const updated = await updateOutreachStatus(id, status);
    if (updated) {
      setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus link konten ini?')) {
      await deleteSavedLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      if (selectedDetailItem?.id === id) {
        setSelectedDetailItem(null);
      }
    }
  };

  const handleAddCategory = async (catData: Omit<Category, 'id' | 'created_at'>) => {
    const created = await createCategory(catData);
    setCategories((prev) => [...prev, created]);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (categoryFilter === id) setCategoryFilter('all');
  };

  // Filtered & Sorted Links
  const filteredLinks = useMemo(() => {
    return links
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchAuthor = item.author_name?.toLowerCase().includes(q) || item.author_username?.toLowerCase().includes(q);
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchAudio = item.audio_title?.toLowerCase().includes(q);
          const matchHashtags = (item.hashtags || []).some((h) => h.toLowerCase().includes(q));
          const matchNotes = item.contact_notes?.toLowerCase().includes(q);
          const matchTalentType = item.talent_type?.toLowerCase().includes(q);
          if (!matchAuthor && !matchTitle && !matchAudio && !matchHashtags && !matchNotes && !matchTalentType) {
            return false;
          }
        }

        // Platform
        if (platformFilter !== 'all' && item.platform !== platformFilter) {
          return false;
        }

        // Category
        if (categoryFilter !== 'all' && item.category_id !== categoryFilter) {
          return false;
        }

        // Talent Type / Persona Demografi
        if (talentTypeFilter !== 'all' && item.talent_type !== talentTypeFilter) {
          return false;
        }

        // Outreach Status
        if (statusFilter !== 'all' && item.outreach_status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'highest_er') {
          return (b.engagement_rate || 0) - (a.engagement_rate || 0);
        }
        if (sortBy === 'highest_views') {
          return (b.views_count || 0) - (a.views_count || 0);
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
  }, [links, searchQuery, platformFilter, categoryFilter, statusFilter, sortBy]);

  const handleResetToRealData = () => {
    if (confirm('Bersihkan data lama dan muat 176 link kurasi dari notes Anda?')) {
      const fresh = resetToRealUserLinks();
      setLinks([...fresh]);
      loadData();
    }
  };

  // Auth guard: show login page if not authenticated
  if (!authChecked) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0b12',
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Memuat...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenBulkModal={() => setIsBulkOpen(true)}
        onOpenCategoryModal={() => setIsCategoryOpen(true)}
        onResetToRealData={handleResetToRealData}
        onLogout={handleLogout}
        totalLinksCount={links.length}
        totalProfilesCount={creatorProfiles.length}
      />

      {/* Supabase Connection Alert Banner */}
      <SupabaseAlertBanner status={supabaseStatus} onRefresh={checkStatus} />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1 }}>
        {/* TAB 1: FEED & CONTENT CURATION */}
        {activeTab === 'feed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 10 }}>
            {/* Search & Filter Toolbar */}
            <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Search input + Platform quick pills */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{
                  flex: 1,
                  minWidth: 260,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 12 }} />
                  <input
                    type="text"
                    placeholder="Cari kreator, @username, caption, hashtag, atau catatan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="search-input"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.85rem',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Platform filter pills */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    onClick={() => setPlatformFilter('all')}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: platformFilter === 'all' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      color: platformFilter === 'all' ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    Semua Platform
                  </button>
                  <button
                    onClick={() => setPlatformFilter('tiktok')}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: platformFilter === 'tiktok' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: platformFilter === 'tiktok' ? '#22d3ee' : 'var(--text-muted)',
                      border: platformFilter === 'tiktok' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    TikTok Only
                  </button>
                  <button
                    onClick={() => setPlatformFilter('instagram')}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: platformFilter === 'instagram' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: platformFilter === 'instagram' ? '#fb7185' : 'var(--text-muted)',
                      border: platformFilter === 'instagram' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    Instagram Only
                  </button>
                </div>
              </div>

              {/* Talent Type / Persona Filter Pills */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: 10,
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', minWidth: 90 }}>
                  Tipe Cewe:
                </span>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', maxWidth: '100%', paddingBottom: 2 }}>
                  <button
                    onClick={() => setTalentTypeFilter('all')}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.73rem',
                      fontWeight: 600,
                      background: talentTypeFilter === 'all' ? '#ec4899' : 'rgba(255, 255, 255, 0.04)',
                      color: '#ffffff',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    Semua Tipe
                  </button>
                  {TALENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setTalentTypeFilter(type)}
                      style={{
                        whiteSpace: 'nowrap',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.73rem',
                        fontWeight: 600,
                        background: talentTypeFilter === type ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                        color: talentTypeFilter === type ? '#f472b6' : 'var(--text-muted)',
                        border: `1px solid ${talentTypeFilter === type ? '#ec4899' : 'var(--border-subtle)'}`,
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills & Sort dropdown */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: 10,
              }}>
                {/* Horizontal scrollable category filters */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', maxWidth: '100%', paddingBottom: 4 }}>
                  <button
                    onClick={() => setCategoryFilter('all')}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: categoryFilter === 'all' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                    }}
                  >
                    Semua Kategori
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      style={{
                        whiteSpace: 'nowrap',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: categoryFilter === cat.id ? `${cat.color}35` : 'rgba(255, 255, 255, 0.04)',
                        color: categoryFilter === cat.id ? cat.color : 'var(--text-muted)',
                        border: `1px solid ${categoryFilter === cat.id ? cat.color : 'var(--border-subtle)'}`,
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Sort & Status Selectors */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CustomSelect
                    value={statusFilter}
                    onChange={(val) => setStatusFilter(val)}
                    options={STATUS_FILTER_OPTIONS}
                    size="sm"
                    width={160}
                  />

                  <CustomSelect
                    value={sortBy}
                    onChange={(val) => setSortBy(val as any)}
                    options={SORT_OPTIONS}
                    size="sm"
                    width={165}
                  />
                </div>
              </div>
            </div>

            {/* Content Cards Grid */}
            {filteredLinks.length === 0 ? (
              <div className="glass-panel" style={{
                padding: '60px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'rgba(139, 92, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                }}>
                  <Inbox size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
                    Tidak ada konten yang cocok
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 420 }}>
                    Coba sesuaikan kata kunci pencarian atau filter kategori, atau tambahkan link baru dari Instagram / TikTok.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button onClick={() => setIsBulkOpen(true)} className="btn-secondary">
                    <FileText size={15} />
                    <span>Import dari Notes</span>
                  </button>
                  <button onClick={() => setIsAddOpen(true)} className="btn-primary">
                    <Plus size={15} />
                    <span>Simpan Link</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="content-grid">
                {filteredLinks.map((link) => {
                  const cat = categories.find((c) => c.id === link.category_id);
                  return (
                    <ContentCard
                      key={link.id}
                      item={link}
                      category={cat}
                      onOpenDetail={(item) => setSelectedDetailItem(item)}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteLink}
                      onOpenCreatorProfile={(username) => {
                        const prof = creatorProfiles.find(p => p.username.toLowerCase() === username.toLowerCase());
                        if (prof) setSelectedProfile(prof);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CREATOR PROFILES & DIRECTORY */}
        {activeTab === 'profiles' && (
          <ProfilesView
            profiles={creatorProfiles}
            categories={categories}
            onSelectProfile={(p) => setSelectedProfile(p)}
            onUpdateStatus={async (linkIds, status) => {
              for (const id of linkIds) {
                await handleUpdateStatus(id, status);
              }
            }}
          />
        )}

        {/* TAB 3: DEEP ANALYTICS & TRENDS */}
        {activeTab === 'analytics' && (
          <AnalyticsView links={links} categories={categories} />
        )}

        {/* TAB 4: TALENT OUTREACH CRM */}
        {activeTab === 'crm' && (
          <OutreachCrmView
            links={links}
            onUpdateStatus={handleUpdateStatus}
            onOpenDetail={(item) => setSelectedDetailItem(item)}
          />
        )}
      </main>

      {/* Modals */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          categories={categories}
          onClose={() => setSelectedProfile(null)}
          onUpdateStatus={async (linkIds, status) => {
            for (const id of linkIds) {
              await handleUpdateStatus(id, status);
            }
            setSelectedProfile((prev) => prev ? { ...prev, outreach_status: status } : null);
          }}
          onOpenContentDetail={(item) => setSelectedDetailItem(item)}
        />
      )}
      {isAddOpen && (
        <AddLinkModal
          categories={categories}
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddLink}
        />
      )}

      {isBulkOpen && (
        <BulkImportModal
          categories={categories}
          onClose={() => setIsBulkOpen(false)}
          onImportComplete={handleBulkImportComplete}
        />
      )}

      {isCategoryOpen && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setIsCategoryOpen(false)}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {selectedDetailItem && (
        <ContentDetailModal
          item={selectedDetailItem}
          categories={categories}
          onClose={() => setSelectedDetailItem(null)}
          onSave={handleUpdateLink}
          onDelete={handleDeleteLink}
          onOpenCreatorProfile={(username) => {
            const prof = creatorProfiles.find(p => p.username.toLowerCase() === username.toLowerCase());
            if (prof) setSelectedProfile(prof);
          }}
        />
      )}
    </div>
  );
}
