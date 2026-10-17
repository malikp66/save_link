import { NextRequest, NextResponse } from 'next/server';
import { getNeonPool, isNeonConfigured } from '@/lib/neon';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isNeonConfigured) {
    return new NextResponse('Database not configured', { status: 503 });
  }

  try {
    const { id } = await params;
    const pool = getNeonPool();
    if (!pool) return new NextResponse('Database pool error', { status: 500 });

    const { rows } = await pool.query(
      'SELECT content_type, image_data, image_base64 FROM media_storage WHERE id = $1 OR link_id = $1 LIMIT 1;',
      [id]
    );

    if (rows.length === 0) {
      return new NextResponse('Media not found', { status: 404 });
    }

    const item = rows[0];
    const contentType = item.content_type || 'image/jpeg';

    if (item.image_data) {
      return new NextResponse(item.image_data, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    if (item.image_base64 && item.image_base64.startsWith('data:')) {
      const base64Data = item.image_base64.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('No image content found', { status: 404 });
  } catch (err: any) {
    console.error('Error fetching media from Neon:', err);
    return new NextResponse(err.message, { status: 500 });
  }
}
