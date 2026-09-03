'use client';

import React from 'react';
import { SavedLink, Category } from '@/types';
import { 
  TrendingUp, 
  BarChart3, 
  Music, 
  Hash, 
  Flame, 
  Users2, 
  Award, 
  Layers 
} from 'lucide-react';

interface AnalyticsViewProps {
  links: SavedLink[];
  categories: Category[];
}

export default function AnalyticsView({ links, categories }: AnalyticsViewProps) {
  // Calculations
  const totalLinks = links.length;
  const avgER = totalLinks > 0 
    ? (links.reduce((acc, l) => acc + (l.engagement_rate || 0), 0) / totalLinks).toFixed(2)
    : '0.00';

  const igCount = links.filter((l) => l.platform === 'instagram').length;
  const tiktokCount = links.filter((l) => l.platform === 'tiktok').length;
  const shortlistedCount = links.filter((l) => ['shortlisted', 'in_discussion', 'collaborated'].includes(l.outreach_status)).length;

  // Category performance
  const categoryStats = categories.map((cat) => {
    const catLinks = links.filter((l) => l.category_id === cat.id);
    const count = catLinks.length;
    const catAvgER = count > 0 
      ? Number((catLinks.reduce((acc, l) => acc + (l.engagement_rate || 0), 0) / count).toFixed(2))
      : 0;
    return {
      name: cat.name,
      color: cat.color,
      count,
      avgER: catAvgER,
    };
  }).filter((c) => c.count > 0).sort((a, b) => b.avgER - a.avgER);

  // Talent Type / Persona Stats
  const talentTypeMap: Record<string, { count: number; totalER: number }> = {};
  links.forEach((l) => {
    const t = l.talent_type || 'Lainnya';
    if (!talentTypeMap[t]) talentTypeMap[t] = { count: 0, totalER: 0 };
    talentTypeMap[t].count += 1;
    talentTypeMap[t].totalER += (l.engagement_rate || 0);
  });
  const talentTypeStats = Object.entries(talentTypeMap).map(([type, data]) => ({
    type,
    count: data.count,
    avgER: Number((data.totalER / Math.max(data.count, 1)).toFixed(2)),
  })).sort((a, b) => b.count - a.count);

  // Trending Sounds
  const soundMap: Record<string, { count: number; sound: string; author: string }> = {};
  links.forEach((l) => {
    if (l.audio_title) {
      const key = l.audio_title.trim();
      if (!soundMap[key]) {
        soundMap[key] = { count: 0, sound: l.audio_title, author: l.audio_author || 'Creator' };
      }
      soundMap[key].count += 1;
    }
  });
  const trendingSounds = Object.values(soundMap).sort((a, b) => b.count - a.count).slice(0, 5);

  // Hashtag aggregation
  const hashtagMap: Record<string, number> = {};
  links.forEach((l) => {
    (l.hashtags || []).forEach((h) => {
      const cleanH = h.toLowerCase().trim();
      hashtagMap[cleanH] = (hashtagMap[cleanH] || 0) + 1;
    });
  });
  const topHashtags = Object.entries(hashtagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Hook format distribution
  const hookMap: Record<string, number> = {};
  links.forEach((l) => {
    const hook = l.hook_type || 'Lainnya';
    hookMap[hook] = (hookMap[hook] || 0) + 1;
  });
  const hookDistribution = Object.entries(hookMap)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / Math.max(totalLinks, 1)) * 100) }))
    .sort((a, b) => b.count - a.count);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 12 }}>
      {/* Top 4 KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {/* KPI 1 */}
        <div className="glass-panel" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Konten Disimpan</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
              <Layers size={16} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalLinks}</p>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Instagram & TikTok pool</span>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rata-rata Engagement Rate</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>{avgER}%</p>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Interaksi vs estimasi penonton</span>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dominasi Platform</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
              <Flame size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22d3ee' }}>
              TikTok ({totalLinks > 0 ? Math.round((tiktokCount / totalLinks) * 100) : 0}%)
            </p>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            IG: {igCount} | TikTok: {tiktokCount}
          </span>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Talent Prioritas (Shortlist)</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Users2 size={16} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>{shortlistedCount}</p>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Kreator siap di-outreach</span>
        </div>
      </div>

      {/* Row 2: Category ER Comparison & Hook Format Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20,
      }}>
        {/* Category Performance Bar */}
        <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Rata-rata Engagement Rate per Kategori</h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Makin tinggi = makin viral</span>
          </div>

          {categoryStats.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '24px 0' }}>
              Belum ada data kategori untuk dihitung.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categoryStats.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 600 }}>{item.name} ({item.count} konten)</span>
                    <span style={{ fontWeight: 700, color: '#34d399' }}>{item.avgER}% ER</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(item.avgER * 7, 100)}%`,
                      background: item.color || 'var(--primary)',
                      borderRadius: 4,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hook Format Breakdown */}
        <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={18} color="#f43f5e" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Pola Hook / Format Konten Terpopuler</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {hookDistribution.map((hk, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{hk.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '50%' }}>
                  <div style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${hk.pct}%`,
                      background: 'linear-gradient(90deg, #f43f5e, #a855f7)',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 34, textAlign: 'right' }}>
                    {hk.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Demographic & Persona Talent Breakdown */}
      <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users2 size={18} color="#ec4899" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Analisis Tren Tipe & Demografi Talent (Chindo, Lokal, Hijab, Fienshyt, Bocil)</h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Popularitas & rata-rata Engagement Rate</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}>
          {talentTypeStats.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f472b6' }}>
                  {item.type}
                </span>
                <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', fontSize: '0.68rem' }}>
                  {item.count} video
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg. ER:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>
                  {item.avgER}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Trending Sounds & Hashtags Cloud */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20,
      }}>
        {/* Trending Audio / Sounds */}
        <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Music size={18} color="#a855f7" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Audio & Sound yang Paling Sering Muncul</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trendingSounds.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '16px 0' }}>
                Belum ada audio terdeteksi.
              </p>
            ) : (
              trendingSounds.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: idx === 0 ? '#fbbf24' : 'var(--text-dim)',
                      width: 18,
                    }}>
                      #{idx + 1}
                    </span>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {s.sound}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Kreator: {s.author}</p>
                    </div>
                  </div>

                  <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                    {s.count} video
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hashtags Cloud */}
        <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Hash size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Trending Hashtag Cluster</h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' }}>
            {topHashtags.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '16px 0', width: '100%' }}>
                Belum ada hashtag terdaftar.
              </p>
            ) : (
              topHashtags.map((h, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: idx < 3 ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    color: idx < 3 ? '#22d3ee' : 'var(--text-main)',
                    border: idx < 3 ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-subtle)',
                    fontSize: idx < 3 ? '0.85rem' : '0.78rem',
                    fontWeight: idx < 3 ? 700 : 500,
                  }}
                >
                  <span>{h.tag}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>({h.count})</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
