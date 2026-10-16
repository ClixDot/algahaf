import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../lib/auth';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { Page } from '../../../../../models/Page';
import { ActivityLog } from '../../../../../models/ActivityLog';
import { getCmsSections, publishAllCmsSections } from '../../../../../lib/cmsData';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { slug } = await params;
    let page: any = null;

    try {
      await connectToDatabase();
      page = await Page.findOne({ slug }).lean();
    } catch (dbErr: any) {
      console.warn('MongoDB connect warning in page detail route:', dbErr.message);
    }

    const titles: Record<string, string> = {
      home: 'Home',
      about: 'About',
      products: 'Products',
      process: 'Process',
      applications: 'Applications',
      contact: 'Contact',
      mova: 'MOVA',
      penta: 'PENTA',
      entra: 'ENTRA',
    };

    if (page) {
      page.title = titles[slug] || (page.title ? page.title.split(/ [—–-] /)[0].trim() : `${slug.charAt(0).toUpperCase() + slug.slice(1)}`);
    } else {
      page = {
        slug,
        title: titles[slug] || `${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
        description: 'Luxury architectural and modular engineering content.',
        seoTitle: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | AlGhaf Collective`,
        seoDescription: 'Prefabricated modular excellence in UAE.',
        status: 'published',
      };
    }

    const sections = await getCmsSections(slug, 'admin');

    return NextResponse.json({ page, sections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { slug } = await params;
    const body = await req.json();

    const updateData: any = {
      ...body,
      updatedBy: auth.session.email,
    };

    if (body.action === 'publish') {
      updateData.status = 'published';
      updateData.lastPublishedAt = new Date();
      // Publish all page sections to live
      await publishAllCmsSections(slug);
    }

    let page = updateData;

    try {
      await connectToDatabase();
      const updated = await Page.findOneAndUpdate({ slug }, updateData, { new: true, upsert: true }).lean();
      if (updated) page = updated;

      await ActivityLog.create({
        userEmail: auth.session.email,
        userName: auth.session.name,
        action: body.action === 'publish' ? 'publish' : 'update',
        entityType: 'page',
        entityId: slug,
        entityName: page.title || slug,
        details: `${body.action === 'publish' ? 'Published' : 'Updated'} page "${page.title || slug}"`,
      });
    } catch (dbErr: any) {
      console.warn('MongoDB update warning (using memory update):', dbErr.message);
    }

    const sections = await getCmsSections(slug, 'admin');

    return NextResponse.json({ success: true, page, sections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
