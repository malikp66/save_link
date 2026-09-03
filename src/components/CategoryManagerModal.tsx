'use client';

import React, { useState } from 'react';
import { Category } from '@/types';
import { X, Plus, Trash2, Tag, Sparkles } from 'lucide-react';

interface CategoryManagerModalProps {
  categories: Category[];
  onClose: () => void;
  onAddCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  onDeleteCategory: (id: string) => void;
}

const PRESET_COLORS = [
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
];

export default function CategoryManagerModal({
  categories,
  onClose,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerModalProps) {
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    onAddCategory({
      name: newCatName.trim(),
      slug,
      color: selectedColor,
      icon: 'tag',
      is_system: false,
    });

    setNewCatName('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520 }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Kelola Kategori Konten</h3>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Add Category Form */}
          <form onSubmit={handleAdd} style={{
            padding: 14,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card-solid)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Buat Kategori Kustom Baru:
            </span>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Nama kategori (contoh: Cosplay, Hijab Style, ASMR)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                }}
              />
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.8rem', opacity: !newCatName.trim() ? 0.5 : 1 }}
              >
                <Plus size={15} />
                <span>Tambah</span>
              </button>
            </div>

            {/* Color Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pilih Warna:</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: c,
                      border: selectedColor === c ? '2px solid #ffffff' : 'none',
                      cursor: 'pointer',
                      transform: selectedColor === c ? 'scale(1.2)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </form>

          {/* Categories List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Daftar Kategori Aktif:
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 260, overflowY: 'auto' }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cat.name}</span>
                    {cat.is_system && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 6px', borderRadius: 4 }}>
                        Bawaan
                      </span>
                    )}
                  </div>

                  {!cat.is_system && (
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      title="Hapus Kategori"
                      style={{ color: 'var(--text-dim)', padding: 4 }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f43f5e')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-dim)')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
