'use client';

import React from 'react';

export default function ContentCardSkeleton() {
  return (
    <div
      className="glass-panel skeleton-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Media Thumbnail Skeleton: 4:5 vertical video ratio */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '125%',
          backgroundColor: '#111422',
          overflow: 'hidden',
        }}
      >
        <div
          className="skeleton-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 0,
          }}
        />

        {/* Top Badges Overlay Shimmer */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Platform Badge */}
          <div
            className="skeleton-shimmer"
            style={{ width: 62, height: 20, borderRadius: 'var(--radius-full)' }}
          />
          {/* ER Badge */}
          <div
            className="skeleton-shimmer"
            style={{ width: 56, height: 20, borderRadius: 'var(--radius-full)' }}
          />
        </div>

        {/* Audio Sound Title Shimmer */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            width: '60%',
            height: 18,
            borderRadius: 'var(--radius-full)',
          }}
          className="skeleton-shimmer"
        />
      </div>

      {/* Card Details Skeleton */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', flex: 1, gap: 12 }}>
        {/* Creator Info Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Avatar Circle */}
            <div
              className="skeleton-shimmer"
              style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }}
            />
            {/* Username & Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div className="skeleton-shimmer" style={{ width: 90, height: 14, borderRadius: 4 }} />
              <div className="skeleton-shimmer" style={{ width: 60, height: 10, borderRadius: 4 }} />
            </div>
          </div>
          {/* Rating */}
          <div className="skeleton-shimmer" style={{ width: 36, height: 16, borderRadius: 4 }} />
        </div>

        {/* Link Type Badge Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="skeleton-shimmer" style={{ width: 95, height: 16, borderRadius: 4 }} />
          <div className="skeleton-shimmer" style={{ width: 75, height: 16, borderRadius: 4 }} />
        </div>

        {/* Caption Snippet lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="skeleton-shimmer" style={{ width: '100%', height: 12, borderRadius: 4 }} />
          <div className="skeleton-shimmer" style={{ width: '70%', height: 12, borderRadius: 4 }} />
        </div>

        {/* Tags / Pills Row */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="skeleton-shimmer" style={{ width: 55, height: 18, borderRadius: 4 }} />
          <div className="skeleton-shimmer" style={{ width: 65, height: 18, borderRadius: 4 }} />
          <div className="skeleton-shimmer" style={{ width: 45, height: 18, borderRadius: 4 }} />
        </div>

        {/* Metrics Row (Views, Likes, Comments) */}
        <div
          className="skeleton-shimmer"
          style={{
            height: 32,
            borderRadius: 'var(--radius-sm)',
            marginTop: 'auto',
          }}
        />

        {/* Bottom Actions Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
            paddingTop: 8,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="skeleton-shimmer" style={{ width: 120, height: 28, borderRadius: 6 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="skeleton-shimmer" style={{ width: 44, height: 28, borderRadius: 6 }} />
            <div className="skeleton-shimmer" style={{ width: 28, height: 28, borderRadius: 6 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
