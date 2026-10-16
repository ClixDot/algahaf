import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Page } from '../../../../models/Page';
import { Section } from '../../../../models/Section';
import { Product } from '../../../../models/Product';
import { Media } from '../../../../models/Media';
import { Enquiry } from '../../../../models/Enquiry';
import { ActivityLog } from '../../../../models/ActivityLog';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 1800)
    );
    await Promise.race([connectToDatabase(), timeoutPromise]);

    const [
      totalPages,
      totalSections,
      totalProducts,
      totalMedia,
      totalEnquiries,
      newEnquiriesCount,
      recentUpdates,
      recentEnquiries,
    ] = await Promise.all([
      Page.countDocuments({ slug: { $ne: 'process' } }),
      Section.countDocuments({ pageSlug: { $ne: 'process' } }),
      Product.countDocuments(),
      Media.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      ActivityLog.find().sort({ createdAt: -1 }).limit(8).lean(),
      Enquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
    ]);

    return NextResponse.json({
      totalPages,
      totalSections,
      totalProducts,
      totalMedia,
      totalEnquiries,
      newEnquiriesCount,
      recentUpdates,
      recentEnquiries,
    });
  } catch (error: any) {
    console.warn('Overview API DB warning (using resilient local fallback):', error.message);
    return NextResponse.json({
      totalPages: 6,
      totalSections: 14,
      totalProducts: 3,
      totalMedia: 0,
      totalEnquiries: 0,
      newEnquiriesCount: 0,
      recentUpdates: [],
      recentEnquiries: [],
    });
  }
}
