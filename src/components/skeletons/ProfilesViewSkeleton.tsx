'use client';

import React from 'react';

export default function ProfilesViewSkeleton() {
  const cards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search & Filter Header Skeleton */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ flex: 1, height: 40, borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton-shimmer" style={{ width: 140, height: 40, borderRadius: 'var(--radius-sm)' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="skeleton-shimmer" style={{ width: 70, height: 26, borderRadius: 'var(--radius-full)' }} />
          <div className="skeleton-shimmer" style={{ width: 80, height: 26, borderRadius: 'var(--radius-full)' }} />
          <div className="skeleton-shimmer" style={{ width: 95, height: 26, borderRadius: 'var(--radius-full)' }} />
          <div className="skeleton-shimmer" style={{ width: 85, height: 26, borderRadius: 'var(--radius-full)' }} />
          <div className="skeleton-shimmer" style={{ width: 110, height: 26, borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      {/* Profile Cards Grid Skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {cards.map((c) => (
          <div
            key={c}
            className="glass-panel skeleton-card"
            style={{
              padding: 16,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {/* Top Identity Row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div
                className="skeleton-shimmer"
                style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0 }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="skeleton-shimmer" style={{ width: 110, height: 16, borderRadius: 4 }} />
                  <div className="skeleton-shimmer" style={{ width: 42, height: 14, borderRadius: 4 }} />
                </div>
                <div className="skeleton-shimmer" style={{ width: 80, height: 14, borderRadius: 4 }} />
                <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                  <div className="skeleton-shimmer" style={{ width: 60, height: 16, borderRadius: 'var(--radius-full)' }} />
                  <div className="skeleton-shimmer" style={{ width: 70, height: 16, borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            </div>

            {/* 4-cell Metrics Box Shimmer */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 6,
                padding: '8px 10px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {[1, 2, 3, 4].map((m) => (
                <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className="skeleton-shimmer" style={{ width: 34, height: 14, borderRadius: 3 }} />
                  <div className="skeleton-shimmer" style={{ width: 44, height: 9, borderRadius: 3 }} />
                </div>
              ))}
            </div>

            {/* Content Thumbnails Mini Preview Strip Shimmer */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3].map((t) => (
                <div
                  key={t}
                  className="skeleton-shimmer"
                  style={{ flex: 1, height: 60, borderRadius: 6 }}
                />
              ))}
            </div>

            {/* Bottom Actions Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div className="skeleton-shimmer" style={{ width: 110, height: 26, borderRadius: 6 }} />
              <div className="skeleton-shimmer" style={{ width: 85, height: 26, borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
