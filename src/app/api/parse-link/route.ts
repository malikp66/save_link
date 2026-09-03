import { NextRequest, NextResponse } from 'next/server';
import { parseSocialLink } from '@/lib/linkParser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL harus diisi' },
        { status: 400 }
      );
    }

    const data = await parseSocialLink(url);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API /api/parse-link error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memproses link' },
      { status: 500 }
    );
  }
}
