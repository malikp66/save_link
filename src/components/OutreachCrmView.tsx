'use client';

import React from 'react';
import { SavedLink, OutreachStatus } from '@/types';
import { 
  Send, 
  Phone, 
  Mail, 
  ExternalLink, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutreachCrmViewProps {
  links: SavedLink[];
  onUpdateStatus: (id: string, status: OutreachStatus) => void;
  onOpenDetail: (item: SavedLink) => void;
}

interface ColumnConfig {
  status: OutreachStatus;
  title: string;
  badgeClass: string;
  icon: string;
}

const COLUMNS: ColumnConfig[] = [
  { status: 'saved', title: 'Baru Disimpan', badgeClass: 'badge-status-saved', icon: '📥' },
  { status: 'shortlisted', title: 'Shortlisted (Tertarik)', badgeClass: 'badge-status-shortlisted', icon: '⭐' },
  { status: 'contacted', title: 'Sudah di-DM / Hubungi', badgeClass: 'badge-status-contacted', icon: '💬' },
  { status: 'in_discussion', title: 'Sedang Diskusi', badgeClass: 'badge-status-in_discussion', icon: '🤝' },
  { status: 'collaborated', title: 'Deal & Collab', badgeClass: 'badge-status-collaborated', icon: '🎉' },
];

export default function OutreachCrmView({
  links,
  onUpdateStatus,
  onOpenDetail,
}: OutreachCrmViewProps) {
  const getNextStatus = (current: OutreachStatus): OutreachStatus | null => {
    const order: OutreachStatus[] = ['saved', 'shortlisted', 'contacted', 'in_discussion', 'collaborated'];
    const idx = order.indexOf(current);
    if (idx !== -1 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStatus = (current: OutreachStatus): OutreachStatus | null => {
    const order: OutreachStatus[] = ['saved', 'shortlisted', 'contacted', 'in_discussion', 'collaborated'];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  const handleAdvance = (id: string, current: OutreachStatus) => {
    const next = getNextStatus(current);
    if (next) {
      onUpdateStatus(id, next);
      if (next === 'collaborated') {
        confetti({ particleCount: 80, spread: 60 });
      }
    }
  };

  const handleRetreat = (id: string, current: OutreachStatus) => {
    const prev = getPrevStatus(current);
    if (prev) {
      onUpdateStatus(id, prev);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 12 }}>
      {/* Overview Banner */}
      <div className="glass-panel" style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Talent Outreach & Touch-Up Pipeline</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Pantau dan tindaklanjuti seluruh kreator potensial mulai dari tahap kurasi, DM penawaran, hingga kesepakatan kerjasama.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total Kreator Aktif: <b style={{ color: 'var(--text-main)' }}>{links.length}</b>
          </span>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(280px, 1fr))',
        gap: 14,
        overflowX: 'auto',
        paddingBottom: 16,
      }}>
        {COLUMNS.map((col) => {
          const colLinks = links.filter((l) => l.outreach_status === col.status);

          return (
            <div
              key={col.status}
              style={{
                background: 'rgba(15, 18, 29, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 520,
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{col.icon}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{col.title}</span>
                </div>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-main)' }}>
                  {colLinks.length}
                </span>
              </div>

              {/* Cards Container */}
              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
                {colLinks.length === 0 ? (
                  <div style={{
                    padding: '30px 10px',
                    textAlign: 'center',
                    color: 'var(--text-dim)',
                    fontSize: '0.78rem',
                    border: '1px dashed rgba(255, 255, 255, 0.06)',
                    borderRadius: 8,
                    marginTop: 10,
                  }}>
                    Tidak ada talent di tahap ini
                  </div>
                ) : (
                  colLinks.map((item) => {
                    const isTiktok = item.platform === 'tiktok';
                    const nextSt = getNextStatus(item.outreach_status);
                    const prevSt = getPrevStatus(item.outreach_status);

                    return (
                      <div
                        key={item.id}
                        className="glass-panel"
                        style={{
                          padding: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                          background: 'rgba(23, 28, 45, 0.85)',
                          border: '1px solid rgba(255, 255, 255, 0.07)',
                          transition: 'transform 0.15s ease, border-color 0.15s ease',
                        }}
                      >
                        {/* Creator Header & Platform */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                            <img
                              src={item.author_avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${item.author_username}`}
                              alt={item.author_name}
                              style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div style={{ overflow: 'hidden' }}>
                              <p style={{ fontSize: '0.82rem', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {item.author_name}
                              </p>
                              <p style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>@{item.author_username}</p>
                            </div>
                          </div>

                          <span className={`badge ${isTiktok ? 'badge-tiktok' : 'badge-ig'}`} style={{ fontSize: '0.65rem' }}>
                            {isTiktok ? 'TT' : 'IG'}
                          </span>
                        </div>

                        {/* Video Snapshot & Caption */}
                        <div 
                          onClick={() => onOpenDetail(item)}
                          style={{
                            display: 'flex',
                            gap: 10,
                            cursor: 'pointer',
                            background: 'rgba(0, 0, 0, 0.25)',
                            padding: 6,
                            borderRadius: 6,
                          }}
                        >
                          <img
                            src={item.thumbnail_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                            alt=""
                            style={{ width: 45, height: 55, borderRadius: 4, objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              lineHeight: 1.3,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}>
                              {item.title}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                              <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                                {item.engagement_rate}% ER
                              </span>
                              {item.rating > 0 && (
                                <span style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Star size={10} fill="#fbbf24" /> {item.rating}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Internal Notes snippet */}
                        {item.contact_notes && (
                          <div style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-dim)',
                            background: 'rgba(255, 255, 255, 0.025)',
                            padding: '4px 8px',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <MessageSquare size={11} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.contact_notes}
                            </span>
                          </div>
                        )}

                        {/* Quick Touch-Up Shortcuts */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 4 }}>
                          {/* Direct DM */}
                          <a
                            href={item.author_profile_url || item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary"
                            style={{ flex: 1, padding: '5px 8px', fontSize: '0.72rem' }}
                            title="Direct Message"
                          >
                            <Send size={11} />
                            <span>DM</span>
                          </a>

                          {/* WhatsApp shortcut if phone is set */}
                          {item.contact_phone && (
                            <a
                              href={`https://wa.me/${item.contact_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo kak ${item.author_name}, tertarik kolaborasi?`)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                padding: '5px 8px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: '0.72rem',
                              }}
                              title="Chat WhatsApp"
                            >
                              <Phone size={11} />
                              <span>WA</span>
                            </a>
                          )}

                          <button
                            onClick={() => onOpenDetail(item)}
                            className="btn-secondary"
                            style={{ padding: '5px 8px', fontSize: '0.72rem' }}
                          >
                            Detail
                          </button>
                        </div>

                        {/* Advance / Move Pipeline Stage Buttons */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          paddingTop: 6,
                        }}>
                          {prevSt ? (
                            <button
                              onClick={() => handleRetreat(item.id, item.outreach_status)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                fontSize: '0.68rem',
                                color: 'var(--text-dim)',
                              }}
                            >
                              <ChevronLeft size={12} /> Mundur
                            </button>
                          ) : <div />}

                          {nextSt && (
                            <button
                              onClick={() => handleAdvance(item.id, item.outreach_status)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                fontSize: '0.68rem',
                                color: '#c084fc',
                                fontWeight: 600,
                              }}
                            >
                              Lanjut <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
