import { NextRequest, NextResponse } from 'next/server';
import { extractWithOmniget, cleanMediaUrl, detectExtendedPlatform } from '@/lib/omnigetEngine';
import { parseSocialLink } from '@/lib/linkParser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL media harus diisi' },
        { status: 400 }
      );
    }

    const cleanUrl = cleanMediaUrl(url);
    const platform = detectExtendedPlatform(cleanUrl);

    // If platform is Instagram or TikTok, prioritize specialized parseSocialLink with OmniGet fallback
    if (platform === 'instagram' || platform === 'tiktok') {
      try {
        const parsed = await parseSocialLink(cleanUrl);
        return NextResponse.json({
          ...parsed,
          extractor: 'linkParser',
          clean_url: cleanUrl,
        });
      } catch (err) {
        console.warn('Standard parser failed, engaging OmniGet engine fallback:', err);
      }
    }

    // Extended OpenSelena / OmniGet extraction (YouTube, X, Reddit, etc.)
    const omnigetData = await extractWithOmniget(cleanUrl);
    return NextResponse.json(omnigetData);
  } catch (error: any) {
    console.error('API /api/extract-media error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memproses media link' },
      { status: 500 }
    );
  }
}
