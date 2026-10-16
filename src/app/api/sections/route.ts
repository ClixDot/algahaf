import { NextRequest, NextResponse } from 'next/server';
import { getCmsSections } from '../../../lib/cmsData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageSlug = searchParams.get('pageSlug') || 'home';

    const sections = await getCmsSections(pageSlug, 'live');
    return NextResponse.json({ success: true, pageSlug, sections }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
