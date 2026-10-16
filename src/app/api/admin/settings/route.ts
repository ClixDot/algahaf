import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { ActivityLog } from '../../../../models/ActivityLog';
import { getGlobalSettings, updateGlobalSettings } from '../../../../lib/settingsData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const settings = await getGlobalSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const settings = await updateGlobalSettings(body);

    try {
      await ActivityLog.create({
        userEmail: auth.session.email,
        userName: auth.session.name,
        action: 'update',
        entityType: 'settings',
        entityName: 'Global Settings & Navigation',
        details: 'Updated global settings, launch flags, header navigation, or footer configurations',
      });
    } catch (logErr) {
      console.warn('Activity log write error:', logErr);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
