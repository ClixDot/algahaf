import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../lib/mongodb';
import { AdminUser } from '../models/AdminUser';
import { Product } from '../models/Product';
import { Page } from '../models/Page';
import { Section } from '../models/Section';
import { GlobalSettings } from '../models/GlobalSettings';
import { products } from '../data/productsData';
import { companyInfo } from '../data/companyData';
import { applicationsData } from '../data/applicationsData';
import { processSteps, processComparison } from '../data/processData';

export async function seedDatabase() {
  console.log('🔄 Connecting to MongoDB for seeding...');
  await connectToDatabase();
  console.log('✅ Connected to MongoDB.');

  // 1. Seed Default Admin User
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'adminalgahaf@.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'algahaf14@admin';
  const existingAdmin = await AdminUser.findOne({
    $or: [{ email: adminEmail.toLowerCase() }, { username: 'adminalgahaf' }]
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    await AdminUser.create({
      name: 'AlGhaf Super Admin',
      email: adminEmail.toLowerCase(),
      username: 'adminalgahaf',
      passwordHash,
      role: 'superadmin',
    });
    console.log(`✅ Default admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed Global Settings
  const existingSettings = await GlobalSettings.findOne();
  if (!existingSettings) {
    await GlobalSettings.create({
      siteName: companyInfo.name,
      tagline: companyInfo.tagline,
      companyName: companyInfo.name,
      legalName: companyInfo.legalName,
      phone: companyInfo.contact.phone,
      email: companyInfo.contact.email,
      address: companyInfo.contact.address,
      city: 'Dubai',
      country: companyInfo.contact.country || 'United Arab Emirates',
      whatsapp: companyInfo.contact.whatsapp,
      instagram: companyInfo.contact.instagram,
      linkedin: companyInfo.contact.linkedin,
      facebook: companyInfo.contact.facebook,
      headerLogo: '/assets/logos/AlGhaf_logo_-10.png',
      footerLogo: '/assets/logos/AlGhaf_logo_-08.png',
      favicon: '/assets/logos/AlGhaf_logo_-10.png',
      headerNav: [
        { label: 'Home', path: '/', isComingSoon: false, order: 1 },
        { label: 'About', path: '/about', isComingSoon: false, order: 2 },
        { label: 'Products', path: '/products', isComingSoon: false, order: 3 },
        { label: 'Applications', path: '/applications', isComingSoon: true, order: 4 },
        { label: 'Contact', path: '/contact', isComingSoon: false, order: 5 },
      ],
      headerCtaText: 'ENQUIRY',
      headerCtaUrl: '#enquiry',
      footerDescription:
        'Transforming housing from a fragmented project into a designed, engineered, and continuously refined product.',
      footerTagline: 'Rooted in Nature. Built for Tomorrow.',
      footerLinks: [
        { category: 'Company', label: 'About AlGhaf & The Ghaf Tree', url: '/about' },
        { category: 'Company', label: 'Project Enquiry & Consultations', url: '/contact' },
        { category: 'Legal', label: 'Privacy Policy', url: '/privacy' },
        { category: 'Legal', label: 'Terms of Service', url: '/terms' },
      ],
      copyrightText: 'AlGhaf Collective. All rights reserved. | Powered by Clixdot',
      defaultSeoTitle: 'AlGhaf Collective — Design Smarter. Build Precisely.',
      defaultSeoDescription:
        'UAE-based integrated design, prefabrication, and modular construction company creating smarter, more sustainable homes through one integrated system.',
      defaultKeywords:
        'AlGhaf Collective, modular homes UAE, prefabrication Dubai, luxury modular architecture, MOVA, PENTA, ENTRA',
      defaultOgImage: '/assets/images/ax.jpg',
    });
    console.log('✅ Global settings seeded.');
  } else {
    console.log('ℹ️ Global settings already exist.');
  }

  // 3. Seed Products (MOVA, PENTA, ENTRA)
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await Product.findOneAndUpdate(
      { id: p.id },
      {
        id: p.id,
        slug: p.slug,
        name: p.name,
        fullName: p.fullName,
        sizeRange: p.sizeRange,
        tagline: p.tagline,
        shortDescription: p.shortDescription,
        category: p.category,
        leadTime: p.leadTime,
        dimensions: (p as any).dimensions || {},
        heroImage: p.heroImage,
        previewImage: p.previewImage,
        features: p.features,
        specifications: (p as any).specifications || {},
        gallery: p.gallery,
        status: 'published',
        displayOrder: i + 1,
      },
      { upsert: true, new: true }
    );
  }
  console.log('✅ Products seeded (MOVA, PENTA, ENTRA).');

  // 4. Seed Pages
  const pagesList = [
    {
      slug: 'home',
      title: 'Home — AlGhaf Collective',
      description: 'Smarter, more sustainable homes designed, engineered, prefabricated, and delivered through one integrated system.',
      seoTitle: 'AlGhaf Collective — Design Smarter. Build Precisely.',
      seoDescription: 'UAE-based integrated design, prefabrication, and modular construction company creating smarter, more sustainable homes.',
    },
    {
      slug: 'about',
      title: 'About AlGhaf & The Ghaf Tree',
      description: 'The story and botanical inspiration behind AlGhaf modular architecture.',
      seoTitle: 'About Us — AlGhaf Collective',
      seoDescription: 'Inspired by the resilient UAE national Ghaf tree, creating sustainable modular homes.',
    },
    {
      slug: 'products',
      title: 'Modular Living Systems & Collections',
      description: 'Engineered architectural product systems: MOVA, PENTA, and ENTRA.',
      seoTitle: 'Products — AlGhaf Collective',
      seoDescription: 'Explore our complete architectural modular catalog.',
    },
    {
      slug: 'applications',
      title: 'Applications & Typologies',
      description: 'From primary luxury residences to estate guest pavilions and eco-resorts.',
      seoTitle: 'Applications — AlGhaf Collective',
      seoDescription: 'Residential, Hospitality, Wellness, and Specialized modular applications.',
    },
    {
      slug: 'contact',
      title: 'Contact & Project Inquiries',
      description: 'Schedule an architectural consultation at Dubai Design District.',
      seoTitle: 'Contact Us — AlGhaf Collective',
      seoDescription: 'Get in touch with our Dubai design and engineering team.',
    },
  ];

  for (const page of pagesList) {
    await Page.findOneAndUpdate(
      { slug: page.slug },
      {
        slug: page.slug,
        title: page.title,
        description: page.description,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        status: 'published',
        lastPublishedAt: new Date(),
      },
      { upsert: true, new: true }
    );
  }
  console.log('✅ Website pages seeded.');

  // 5. Seed Core Sections for Home Page
  const homeSections = [
    {
      pageSlug: 'home',
      sectionId: 'home-hero',
      sectionName: 'Hero Cinematic Banner',
      eyebrow: 'MODULAR LIVING SYSTEMS — UAE',
      title: 'Design Smarter.\nBuild Precisely.',
      subtitle:
        'Smarter, more sustainable homes designed, engineered, prefabricated, and delivered through one integrated system.',
      mediaUrl: '/assets/images/hero1.jpeg',
      mediaType: 'image',
      ctaText: 'EXPLORE COLLECTIONS',
      ctaUrl: '/products',
      displayOrder: 1,
      isVisible: true,
    },
    {
      pageSlug: 'home',
      sectionId: 'home-origin',
      sectionName: 'Origin & Philosophy Story',
      eyebrow: 'THE ALGHAF PHILOSOPHY',
      title: 'Rooted in the Desert.\nEngineered for Tomorrow.',
      subtitle:
        'The Ghaf tree is the national tree of the United Arab Emirates — an enduring symbol of resilience, drought resistance, and sustained life.',
      content:
        'Inspired by this botanical icon, AlGhaf Collective reimagines residential living: precision-engineered homes that withstand desert conditions while providing extraordinary thermal comfort, architectural refinement, and energy harmony.',
      mediaUrl: '/assets/images/story-botanical.png',
      ctaText: 'READ OUR STORY',
      ctaUrl: '/about',
      displayOrder: 2,
      isVisible: true,
    },
    {
      pageSlug: 'home',
      sectionId: 'home-process-intro',
      sectionName: 'From Project to Product Intro',
      eyebrow: 'INTEGRATED MODULAR SYSTEM',
      title: 'Housing Shouldn’t Be a Broken Construction Project.',
      subtitle:
        'Traditional homebuilding is plagued by fragmented contractors, sequential delays, weather exposure, and unpredictable costs. AlGhaf turns building into a precision-manufactured product.',
      displayOrder: 3,
      isVisible: true,
    },
  ];

  for (const sec of homeSections) {
    await Section.findOneAndUpdate(
      { pageSlug: sec.pageSlug, sectionId: sec.sectionId },
      sec,
      { upsert: true, new: true }
    );
  }
  console.log('✅ Core sections seeded.');

  return { success: true, message: 'Database successfully seeded with AlGhaf Collective data.' };
}

if (typeof require !== 'undefined' && require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding error:', err);
      process.exit(1);
    });
}
