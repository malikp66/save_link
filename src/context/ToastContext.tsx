'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const hideToast = useCallback((id: string) => {
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 2800) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { id, message, type, duration };

    setToasts((prev) => [...prev.slice(-2), newToast]); // keep max 3 visible toasts

    if (duration > 0) {
      const timer = setTimeout(() => {
        hideToast(id);
      }, duration);
      timeoutsRef.current.set(id, timer);
    }
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Floating Snackbar Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
          width: '90%',
          maxWidth: 440,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '11px 16px',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: toast.type === 'success' 
                ? '1px solid rgba(52, 211, 153, 0.5)' 
                : toast.type === 'error'
                ? '1px solid rgba(244, 63, 94, 0.5)'
                : '1px solid rgba(56, 189, 248, 0.5)',
              boxShadow: toast.type === 'success'
                ? '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 20px rgba(52, 211, 153, 0.25)'
                : '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 20px rgba(139, 92, 246, 0.25)',
              backdropFilter: 'blur(16px)',
              color: '#f8fafc',
              fontSize: '0.84rem',
              fontWeight: 600,
              animation: 'toastSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
              {toast.type === 'success' && (
                <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0 }} />
              )}
              {toast.type === 'error' && (
                <AlertCircle size={18} color="#f43f5e" style={{ flexShrink: 0 }} />
              )}
              {toast.type === 'info' && (
                <Info size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
              )}
              <span style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                lineHeight: 1.4,
              }}>
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => hideToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
                marginLeft: 6,
                flexShrink: 0,
                borderRadius: '50%',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-dim)')}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes toastSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
