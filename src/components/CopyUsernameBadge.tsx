'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface CopyUsernameBadgeProps {
  username: string;
  size?: 'xs' | 'sm' | 'md';
  showAt?: boolean;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function CopyUsernameBadge({
  username,
  size = 'sm',
  showAt = true,
  color,
  style,
  className = '',
}: CopyUsernameBadgeProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const cleanUsername = (username || '').replace(/^@/, '').trim();
  const displayHandle = showAt ? `@${cleanUsername}` : cleanUsername;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!cleanUsername) return;

    try {
      const textToCopy = `@${cleanUsername}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      showToast(`Username @${cleanUsername} berhasil disalin!`, 'success');

      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch (err) {
      console.error('Failed to copy username:', err);
      showToast('Gagal menyalin username ke clipboard', 'error');
    }
  };

  const fontSizes = {
    xs: '0.72rem',
    sm: '0.82rem',
    md: '0.94rem',
  };

  const iconSizes = {
    xs: 11,
    sm: 12,
    md: 14,
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Klik untuk salin username"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        cursor: 'pointer',
        background: copied ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.04)',
        border: copied ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 6,
        padding: size === 'xs' ? '1px 6px' : size === 'sm' ? '2px 7px' : '3px 9px',
        color: copied ? '#34d399' : (color || 'var(--text-main)'),
        fontSize: fontSizes[size],
        fontWeight: 700,
        transition: 'all 0.18s ease',
        userSelect: 'none',
        outline: 'none',
        maxWidth: '100%',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
          e.currentTarget.style.color = '#c084fc';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.color = color || 'var(--text-main)';
        }
      }}
    >
      <span style={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
      }}>
        {displayHandle}
      </span>

      {copied ? (
        <Check 
          size={iconSizes[size]} 
          color="#34d399" 
          style={{ flexShrink: 0, animation: 'scaleIn 0.2s ease' }} 
        />
      ) : (
        <Copy 
          size={iconSizes[size]} 
          style={{ flexShrink: 0, opacity: 0.75 }} 
        />
      )}
    </button>
  );
}
