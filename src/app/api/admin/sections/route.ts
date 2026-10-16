import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { ActivityLog } from '../../../../models/ActivityLog';
import {
  getCmsSections,
  saveCmsSection,
  reorderCmsSections,
  publishAllCmsSections,
} from '../../../../lib/cmsData';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const pageSlug = searchParams.get('pageSlug') || 'home';
    const mode = searchParams.get('mode') === 'live' ? 'live' : 'admin';

    const sections = await getCmsSections(pageSlug, mode);
    return NextResponse.json({ sections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();

    if (!body.pageSlug || !body.sectionId || !body.sectionName) {
      return NextResponse.json(
        { error: 'pageSlug, sectionId, and sectionName are required' },
        { status: 400 }
      );
    }

    const publishNow = body.action === 'publish' || body.status === 'published';
    const section = await saveCmsSection(body, publishNow);

    try {
      await ActivityLog.create({
        userEmail: auth.session.email,
        userName: auth.session.name,
        action: publishNow ? 'publish' : 'update',
        entityType: 'section',
        entityId: section.sectionId,
        entityName: `${section.pageSlug} / ${section.sectionName}`,
        details: `${publishNow ? 'Published' : 'Saved draft for'} section "${section.sectionName}"`,
      });
    } catch (logErr) {
      console.warn('Activity log write error:', logErr);
    }

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { pageSlug = 'home', orders, action } = body;

    if (action === 'publish_all') {
      await publishAllCmsSections(pageSlug);
      const sections = await getCmsSections(pageSlug, 'admin');

      try {
        await ActivityLog.create({
          userEmail: auth.session.email,
          userName: auth.session.name,
          action: 'publish',
          entityType: 'page',
          entityId: pageSlug,
          entityName: `${pageSlug} Page`,
          details: `Published all sections of ${pageSlug} to live website`,
        });
      } catch (logErr) {
        console.warn('Activity log write error:', logErr);
      }

      return NextResponse.json({ success: true, sections, message: 'All sections published to live website.' });
    }

    if (Array.isArray(orders)) {
      await reorderCmsSections(pageSlug, orders);
      const sections = await getCmsSections(pageSlug, 'admin');
      return NextResponse.json({ success: true, sections, message: 'Sections reordered successfully.' });
    }

    return NextResponse.json({ error: 'Invalid PUT request payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
