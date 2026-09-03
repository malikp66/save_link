'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left: number; width: number; openUpwards: boolean }>({
    left: 0,
    width: 0,
    openUpwards: false,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update floating menu coordinates
  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < 220 && rect.top > 220;

    setCoords({
      left: rect.left,
      width: Math.max(rect.width, 150),
      top: openUpwards ? undefined : rect.bottom + 5,
      bottom: openUpwards ? window.innerHeight - rect.top + 5 : undefined,
      openUpwards,
    });
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  // Reposition on scroll / resize or close
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updateCoords();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
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

  // Floating Portal Menu
  const portalMenu = mounted && isOpen ? createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: coords.top !== undefined ? `${coords.top}px` : 'auto',
        bottom: coords.bottom !== undefined ? `${coords.bottom}px` : 'auto',
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        minWidth: 150,
        zIndex: 999999,
        background: '#121526',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: 'var(--radius-md)',
        padding: 4,
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.85), 0 0 20px rgba(139, 92, 246, 0.25)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        maxHeight: 240,
        overflowY: 'auto',
        animation: 'portalDropdownFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
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
              padding: isSmall ? '7px 10px' : '9px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: isSmall ? '0.75rem' : '0.82rem',
              fontWeight: isSelected ? 700 : 500,
              color: isSelected ? (option.color || '#c084fc') : '#f1f5f9',
              background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.12s ease, color 0.12s ease',
              userSelect: 'none',
              margin: '2px 0',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
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

      <style jsx global>{`
        @keyframes portalDropdownFadeIn {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(-2px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>,
    document.body
  ) : null;

  return (
    <div
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
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
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
          boxShadow: isOpen ? '0 0 12px rgba(139, 92, 246, 0.3)' : 'none',
          transition: 'all 0.15s ease',
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

      {/* Render Portal outside the card/modal DOM hierarchy */}
      {portalMenu}
    </div>
  );
}
