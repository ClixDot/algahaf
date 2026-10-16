import { NextResponse } from 'next/server';
import { getGlobalSettings } from '../../../lib/settingsData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getGlobalSettings();
    return NextResponse.json(
      { success: true, settings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

