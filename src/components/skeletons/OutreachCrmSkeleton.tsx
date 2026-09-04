'use client';

import React from 'react';

export default function OutreachCrmSkeleton() {
  const columns = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Pipeline Stats Banner Shimmer */}
      <div className="glass-panel skeleton-card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: 140, height: 18, borderRadius: 4 }} />
          <div className="skeleton-shimmer" style={{ width: 80, height: 22, borderRadius: 'var(--radius-full)' }} />
        </div>
        <div className="skeleton-shimmer" style={{ width: 120, height: 32, borderRadius: 8 }} />
      </div>

      {/* 5-6 Kanban Columns Horizontal Scroll Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 14,
          alignItems: 'flex-start',
        }}
      >
        {columns.map((col) => (
          <div
            key={col}
            className="glass-panel skeleton-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 480,
            }}
          >
            {/* Column Header */}
            <div
              style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="skeleton-shimmer" style={{ width: 16, height: 16, borderRadius: 4 }} />
                <div className="skeleton-shimmer" style={{ width: 85, height: 16, borderRadius: 4 }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: 26, height: 18, borderRadius: 'var(--radius-full)' }} />
            </div>

            {/* Column Cards Shimmer */}
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2].map((card) => (
                <div
                  key={card}
                  style={{
                    padding: 12,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(23, 28, 45, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {/* Creator Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="skeleton-shimmer" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div className="skeleton-shimmer" style={{ width: 75, height: 12, borderRadius: 3 }} />
                        <div className="skeleton-shimmer" style={{ width: 55, height: 10, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div className="skeleton-shimmer" style={{ width: 30, height: 16, borderRadius: 4 }} />
                  </div>

                  {/* Thumbnail & snippet */}
                  <div style={{ display: 'flex', gap: 8, background: 'rgba(0, 0, 0, 0.25)', padding: 6, borderRadius: 6 }}>
                    <div className="skeleton-shimmer" style={{ width: 45, height: 55, borderRadius: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div className="skeleton-shimmer" style={{ width: '100%', height: 10, borderRadius: 2 }} />
                      <div className="skeleton-shimmer" style={{ width: '80%', height: 10, borderRadius: 2 }} />
                      <div className="skeleton-shimmer" style={{ width: 50, height: 14, borderRadius: 4, marginTop: 4 }} />
                    </div>
                  </div>

                  {/* Move status buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <div className="skeleton-shimmer" style={{ width: 45, height: 22, borderRadius: 4 }} />
                    <div className="skeleton-shimmer" style={{ width: 45, height: 22, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
