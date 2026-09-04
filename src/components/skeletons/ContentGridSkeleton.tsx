'use client';

import React from 'react';
import ContentCardSkeleton from './ContentCardSkeleton';

interface ContentGridSkeletonProps {
  count?: number;
}

export default function ContentGridSkeleton({ count = 8 }: ContentGridSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="content-grid">
      {items.map((key) => (
        <ContentCardSkeleton key={key} />
      ))}
    </div>
  );
}
