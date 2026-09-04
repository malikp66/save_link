'use client';

import React from 'react';

export default function AnalyticsViewSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 4 KPI Metric Cards Shimmer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {[1, 2, 3, 4].map((k) => (
          <div
            key={k}
            className="glass-panel skeleton-card"
            style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-shimmer" style={{ width: 90, height: 14, borderRadius: 4 }} />
              <div className="skeleton-shimmer" style={{ width: 32, height: 32, borderRadius: 8 }} />
            </div>
            <div className="skeleton-shimmer" style={{ width: 110, height: 28, borderRadius: 6 }} />
            <div className="skeleton-shimmer" style={{ width: 130, height: 12, borderRadius: 4 }} />
          </div>
        ))}
      </div>

      {/* 2 Big Analysis & Chart Cards Shimmer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
        }}
      >
        {[1, 2].map((c) => (
          <div
            key={c}
            className="glass-panel skeleton-card"
            style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-shimmer" style={{ width: 160, height: 18, borderRadius: 4 }} />
              <div className="skeleton-shimmer" style={{ width: 70, height: 24, borderRadius: 6 }} />
            </div>

            {/* Chart Bars Simulation Shimmer */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, paddingTop: 20 }}>
              {[60, 85, 45, 100, 75, 90, 50, 65].map((h, i) => (
                <div
                  key={i}
                  className="skeleton-shimmer"
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: '4px 4px 0 0',
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton-shimmer" style={{ width: 100, height: 12, borderRadius: 4 }} />
              <div className="skeleton-shimmer" style={{ width: 100, height: 12, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Top Leaderboard Shimmer Card */}
      <div className="glass-panel skeleton-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="skeleton-shimmer" style={{ width: 200, height: 20, borderRadius: 4 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="skeleton-shimmer" style={{ width: 22, height: 22, borderRadius: 4 }} />
                <div className="skeleton-shimmer" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div className="skeleton-shimmer" style={{ width: 110, height: 14, borderRadius: 4 }} />
                  <div className="skeleton-shimmer" style={{ width: 70, height: 10, borderRadius: 4 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div className="skeleton-shimmer" style={{ width: 60, height: 14, borderRadius: 4 }} />
                <div className="skeleton-shimmer" style={{ width: 70, height: 20, borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
