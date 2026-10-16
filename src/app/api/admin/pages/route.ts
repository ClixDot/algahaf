import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Page } from '../../../../models/Page';
import { Section } from '../../../../models/Section';
import { ActivityLog } from '../../../../models/ActivityLog';

const DEFAULT_PAGES_LIST = [
  {
    slug: 'home',
    title: 'Home',
    description: 'Smarter, more sustainable homes designed, engineered, prefabricated, and delivered through one integrated system.',
    seoTitle: 'AlGhaf Collective — Design Smarter. Build Precisely.',
    seoDescription: 'UAE-based integrated design, prefabrication, and modular construction company creating smarter, more sustainable homes.',
    status: 'published',
    sectionCount: 7,
  },
  {
    slug: 'about',
    title: 'About',
    description: 'The story and botanical inspiration behind AlGhaf modular architecture.',
    seoTitle: 'About Us — AlGhaf Collective',
    seoDescription: 'Inspired by the resilient UAE national Ghaf tree, creating sustainable modular homes.',
    status: 'published',
    sectionCount: 4,
  },
  {
    slug: 'products',
    title: 'Products',
    description: 'Engineered architectural product systems: MOVA, PENTA, and ENTRA.',
    seoTitle: 'Products — AlGhaf Collective',
    seoDescription: 'Explore our complete architectural modular catalog.',
    status: 'published',
    sectionCount: 3,
  },
  {
    slug: 'applications',
    title: 'Applications',
    description: 'From primary luxury residences to estate guest pavilions and eco-resorts.',
    seoTitle: 'Applications — AlGhaf Collective',
    seoDescription: 'Residential, Hospitality, Wellness, and Specialized modular applications.',
    status: 'published',
    sectionCount: 4,
  },
  {
    slug: 'contact',
    title: 'Contact',
    description: 'Schedule an architectural consultation at Dubai Design District.',
    seoTitle: 'Contact Us — AlGhaf Collective',
    seoDescription: 'Get in touch with our Dubai design and engineering team.',
    status: 'published',
    sectionCount: 2,
  },
];

const cleanTitleMap: Record<string, string> = {
  home: 'Home',
  about: 'About',
  products: 'Products',
  applications: 'Applications',
  contact: 'Contact',
  mova: 'MOVA',
  penta: 'PENTA',
  entra: 'ENTRA',
};

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    await connectToDatabase();
    try {
      await Page.deleteOne({ slug: 'process' });
    } catch {}

    const pages = await Page.find({ slug: { $ne: 'process' } }).sort({ title: 1 }).lean();

    if (pages && pages.length > 0) {
      const pagesWithCount = await Promise.all(
        pages.map(async (page) => {
          const cleanTitle = cleanTitleMap[page.slug] || (page.title ? page.title.split(/ [—–-] /)[0].trim() : page.title);
          try {
            const sectionCount = await Section.countDocuments({ pageSlug: page.slug });
            return {
              ...page,
              title: cleanTitle,
              sectionCount: sectionCount || (page.slug === 'home' ? 7 : 3),
            };
          } catch {
            return { ...page, title: cleanTitle, sectionCount: page.slug === 'home' ? 7 : 3 };
          }
        })
      );
      return NextResponse.json({ pages: pagesWithCount });
    }
  } catch (error: any) {
    console.warn('MongoDB connect warning in pages route:', error.message);
  }

  // Resilient fallback if MongoDB is unreachable
  return NextResponse.json({ pages: DEFAULT_PAGES_LIST });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const data = await req.json();
    if (!data.slug || !data.title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    const cleanSlug = data.slug.trim().toLowerCase();
    let page = {
      ...data,
      slug: cleanSlug,
      updatedBy: auth.session.email,
    };

    try {
      await connectToDatabase();
      const saved = await Page.findOneAndUpdate(
        { slug: cleanSlug },
        page,
        { upsert: true, new: true }
      ).lean();
      if (saved) page = saved;

      await ActivityLog.create({
        userEmail: auth.session.email,
        userName: auth.session.name,
        action: 'update',
        entityType: 'page',
        entityId: cleanSlug,
        entityName: page.title,
        details: `Updated metadata for page "${page.title}"`,
      });
    } catch (dbErr: any) {
      console.warn('MongoDB update warning in pages route:', dbErr.message);
    }

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
