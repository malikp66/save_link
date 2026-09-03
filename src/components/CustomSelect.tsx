'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
  color?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md';
  width?: string | number;
  style?: React.CSSProperties;
  id?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  size = 'md',
  width,
  style,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isSmall = size === 'sm';

  return (
    <div
      ref={containerRef}
      id={id}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: width || (style?.width ? undefined : '100%'),
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: isSmall ? '6px 10px' : '9px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(23, 28, 45, 0.85)',
          border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
          color: selectedOption?.color || 'var(--text-main)',
          fontSize: isSmall ? '0.74rem' : '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 12px rgba(139, 92, 246, 0.25)' : 'none',
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.icon && (
            <span style={{ fontSize: isSmall ? '0.85rem' : '0.95rem', display: 'flex', alignItems: 'center' }}>
              {selectedOption.icon}
            </span>
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={isSmall ? 13 : 15}
          color="var(--text-muted)"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Glassmorphic Dark Popover Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: 0,
            right: 0,
            minWidth: 150,
            zIndex: 1000,
            background: '#121526',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-md)',
            padding: 4,
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.75), 0 0 15px rgba(139, 92, 246, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            maxHeight: 250,
            overflowY: 'auto',
            animation: 'dropdownFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isSmall ? '6px 10px' : '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: isSmall ? '0.74rem' : '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? (option.color || '#c084fc') : 'var(--text-main)',
                  background: isSelected ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, color 0.15s ease',
                  userSelect: 'none',
                  margin: '1px 0',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.07)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  {option.icon && (
                    <span style={{ fontSize: isSmall ? '0.85rem' : '0.95rem', display: 'flex', alignItems: 'center' }}>
                      {option.icon}
                    </span>
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {option.label}
                  </span>
                </div>

                {isSelected && (
                  <Check size={14} color={option.color || '#c084fc'} style={{ flexShrink: 0, marginLeft: 8 }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
