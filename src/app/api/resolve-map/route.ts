import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const trimmed = rawUrl.trim();

    // 1. If user pasted maps.app.goo.gl or goo.gl short link, resolve redirect
    if (trimmed.includes('goo.gl')) {
      const headRes = await fetch(trimmed, {
        method: 'HEAD',
        redirect: 'manual',
      });
      const location = headRes.headers.get('location') || '';
      if (location) {
        const placeMatch = location.match(/\/place\/([^/@?]+)/);
        const coordsMatch = location.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

        if (placeMatch && placeMatch[1]) {
          const placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
          return NextResponse.json({
            embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`,
            placeName,
            resolvedUrl: location,
          });
        }

        if (coordsMatch) {
          return NextResponse.json({
            embedUrl: `https://maps.google.com/maps?q=${coordsMatch[1]},${coordsMatch[2]}&output=embed`,
            resolvedUrl: location,
          });
        }
      }
    }

    // 2. If it's already an embed link
    if (trimmed.includes('/embed') || trimmed.includes('output=embed')) {
      return NextResponse.json({ embedUrl: trimmed });
    }

    // 3. Fallback convert
    return NextResponse.json({
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
