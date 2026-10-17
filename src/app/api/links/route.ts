import { NextRequest, NextResponse } from 'next/server';
import { getNeonPool, isNeonConfigured } from '@/lib/neon';

export async function GET(req: NextRequest) {
  if (!isNeonConfigured) {
    return NextResponse.json({ links: [], source: 'neon_not_configured' });
  }

  try {
    const pool = getNeonPool();
    if (!pool) {
      return NextResponse.json({ error: 'Pool unavailable' }, { status: 500 });
    }

    const { rows } = await pool.query(`
      SELECT 
        id, platform, url, media_type, author_username, author_name,
        author_avatar_url, author_profile_url, title, thumbnail_url,
        embed_html, audio_title, audio_author, hashtags, views_count,
        likes_count, comments_count, shares_count, engagement_rate,
        rating, category_id, talent_type, tags, hook_type, outreach_status,
        contact_phone, contact_email, contact_notes, last_contacted_at,
        created_at, updated_at
      FROM saved_links
      ORDER BY created_at DESC;
    `);

    // Ensure numeric types and array formats are properly formatted for JS
    const formatted = rows.map((r) => ({
      ...r,
      views_count: Number(r.views_count || 0),
      likes_count: Number(r.likes_count || 0),
      comments_count: Number(r.comments_count || 0),
      shares_count: Number(r.shares_count || 0),
      engagement_rate: parseFloat(r.engagement_rate || 0),
      rating: Number(r.rating || 0),
      hashtags: Array.isArray(r.hashtags) ? r.hashtags : [],
      tags: Array.isArray(r.tags) ? r.tags : [],
    }));

    return NextResponse.json({ links: formatted, count: formatted.length, source: 'neon' });
  } catch (err: any) {
    console.error('Neon GET /api/links error:', err);
    return NextResponse.json({ error: err.message || 'Database query error' }, { status: 500 });
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
    const id = body.id || `neon-link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const result = await pool.query(`
      INSERT INTO saved_links (
        id, platform, url, media_type, author_username, author_name,
        author_avatar_url, author_profile_url, title, thumbnail_url,
        embed_html, audio_title, audio_author, hashtags, views_count,
        likes_count, comments_count, shares_count, engagement_rate,
        rating, category_id, talent_type, tags, hook_type, outreach_status,
        contact_phone, contact_email, contact_notes, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      )
      ON CONFLICT (url) DO UPDATE SET
        title = EXCLUDED.title,
        thumbnail_url = EXCLUDED.thumbnail_url,
        category_id = EXCLUDED.category_id,
        talent_type = EXCLUDED.talent_type,
        hook_type = EXCLUDED.hook_type,
        tags = EXCLUDED.tags,
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `, [
      id,
      body.platform || 'tiktok',
      body.url,
      body.media_type || 'reel',
      body.author_username || '',
      body.author_name || '',
      body.author_avatar_url || '',
      body.author_profile_url || '',
      body.title || '',
      body.thumbnail_url || '',
      body.embed_html || null,
      body.audio_title || '',
      body.audio_author || '',
      body.hashtags || [],
      body.views_count || 0,
      body.likes_count || 0,
      body.comments_count || 0,
      body.shares_count || 0,
      body.engagement_rate || 0,
      body.rating || 0,
      body.category_id || null,
      body.talent_type || '',
      body.tags || [],
      body.hook_type || '',
      body.outreach_status || 'saved',
      body.contact_phone || '',
      body.contact_email || '',
      body.contact_notes || '',
      body.created_at || now,
      now,
    ]);

    return NextResponse.json({ success: true, link: result.rows[0] });
  } catch (err: any) {
    console.error('Neon POST /api/links error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isNeonConfigured) {
    return NextResponse.json({ error: 'Neon not configured' }, { status: 503 });
  }

  try {
    const pool = getNeonPool();
    if (!pool) return NextResponse.json({ error: 'No pool' }, { status: 500 });

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, val] of Object.entries(updates)) {
      if (['id', 'created_at'].includes(key)) continue;
      setClauses.push(`${key} = $${idx}`);
      values.push(val);
      idx++;
    }

    setClauses.push(`updated_at = $${idx}`);
    values.push(new Date().toISOString());
    idx++;

    values.push(id);
    const sql = `UPDATE saved_links SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *;`;
    const result = await pool.query(sql, values);

    return NextResponse.json({ success: true, link: result.rows[0] });
  } catch (err: any) {
    console.error('Neon PATCH /api/links error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isNeonConfigured) {
    return NextResponse.json({ error: 'Neon not configured' }, { status: 503 });
  }

  try {
    const pool = getNeonPool();
    if (!pool) return NextResponse.json({ error: 'No pool' }, { status: 500 });

    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await pool.query('DELETE FROM saved_links WHERE id = $1;', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Neon DELETE /api/links error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
