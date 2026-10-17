import { NextRequest, NextResponse } from 'next/server';
import { getNeonPool, isNeonConfigured } from '@/lib/neon';

export async function GET(req: NextRequest) {
  if (!isNeonConfigured) {
    return NextResponse.json({ categories: [], source: 'neon_not_configured' });
  }

  try {
    const pool = getNeonPool();
    if (!pool) return NextResponse.json({ error: 'No pool' }, { status: 500 });

    const { rows } = await pool.query(`
      SELECT id, name, slug, color, icon, is_system, created_at 
      FROM categories 
      ORDER BY created_at ASC;
    `);

    return NextResponse.json({ categories: rows, source: 'neon' });
  } catch (err: any) {
    console.error('Neon GET /api/categories error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isNeonConfigured) {
    return NextResponse.json({ error: 'Neon not configured' }, { status: 503 });
  }

  try {
    const pool = getNeonPool();
    if (!pool) return NextResponse.json({ error: 'No pool' }, { status: 500 });

    const body = await req.json();
    const id = body.id || `cat-${Date.now()}`;

    const { rows } = await pool.query(`
      INSERT INTO categories (id, name, slug, color, icon, is_system)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        color = EXCLUDED.color,
        icon = EXCLUDED.icon
      RETURNING *;
    `, [
      id,
      body.name,
      body.slug,
      body.color || '#8b5cf6',
      body.icon || 'tag',
      Boolean(body.is_system),
    ]);

    return NextResponse.json({ success: true, category: rows[0] });
  } catch (err: any) {
    console.error('Neon POST /api/categories error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
