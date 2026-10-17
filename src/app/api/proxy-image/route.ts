import { NextRequest, NextResponse } from 'next/server';
import { getNeonPool, isNeonConfigured } from '@/lib/neon';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new NextResponse('Invalid protocol', { status: 400 });
    }

    const isInstagram = parsed.hostname.includes('instagram.com') || parsed.hostname.includes('fbcdn.net') || parsed.hostname.includes('cdninstagram.com');
    const isTikTok = parsed.hostname.includes('tiktokcdn') || parsed.hostname.includes('tiktok.com') || parsed.hostname.includes('byteoversea.com');

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    if (isInstagram) {
      headers['Referer'] = 'https://www.instagram.com/';
    } else if (isTikTok) {
      headers['Referer'] = 'https://www.tiktok.com/';
    }

    let targetUrl = url;

    // First attempt to fetch the requested image
    let res = await fetch(targetUrl, {
      headers,
      signal: AbortSignal.timeout(7000),
    });

    // If 403 and it's Instagram post/reel, try resolving via /media/?size=l
    if (!res.ok && isInstagram) {
      const pMatch = url.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
      if (pMatch) {
        try {
          const directUrl = `https://www.instagram.com/${pMatch[1]}/${pMatch[2]}/media/?size=l`;
          const redirectRes = await fetch(directUrl, {
            headers: { 'User-Agent': headers['User-Agent'] },
            redirect: 'follow',
            signal: AbortSignal.timeout(6000),
          });
          if (redirectRes.ok) {
            res = redirectRes;
          }
        } catch (e) {}
      }
    }

    // If still not OK, check Neon DB media_storage
    if (!res.ok && isNeonConfigured) {
      try {
        const pool = getNeonPool();
        if (pool) {
          const { rows } = await pool.query(
            'SELECT content_type, image_data, image_base64 FROM media_storage WHERE original_url = $1 LIMIT 1;',
            [url]
          );
          if (rows.length > 0 && rows[0].image_data) {
            return new NextResponse(rows[0].image_data, {
              status: 200,
              headers: {
                'Content-Type': rows[0].content_type || 'image/jpeg',
                'Cache-Control': 'public, max-age=604800, immutable',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        }
      } catch (e) {}
    }

    if (!res.ok) {
      // Return a graceful SVG placeholder instead of throwing 403 in console
      const placeholderSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#181826" />
              <stop offset="100%" stop-color="#0c0d15" />
            </linearGradient>
          </defs>
          <rect width="600" height="800" fill="url(#g)" />
          <circle cx="300" cy="380" r="50" fill="#2d2d42" />
          <path d="M280 370 L320 370 L300 400 Z" fill="#8b5cf6" />
          <text x="300" y="470" fill="#71717a" font-size="18" font-family="sans-serif" text-anchor="middle">Preview Konten</text>
        </svg>
      `.trim();

      return new NextResponse(placeholderSvg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new NextResponse('Image fetch error', { status: 500 });
  }
}
