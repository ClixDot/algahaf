import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const uri = 'mongodb+srv://algahaf:algahaf2027@cluster0.kqhmfji.mongodb.net/alghaf?retryWrites=true&w=majority';

const ALL_HOME_SECTIONS = [
  {
    pageSlug: 'home',
    sectionId: 'home-hero',
    sectionName: 'Hero Cinematic Banner',
    thumbnailUrl: '/assets/images/hero1.jpeg',
    eyebrow: 'SCENE:',
    title: 'Design Smarter.\nBuild Precisely.',
    subtitle: 'Designing buildings that respond to real needs and real environments, with a focus on the function.',
    mediaUrl: '/assets/images/hero1.jpeg',
    mediaType: 'image',
    displayOrder: 1,
    isVisible: true,
    status: 'published',
    items: [
      { id: 'hero1', url: '/assets/images/hero1.jpeg', label: 'Palm Residence', position: 'center 42%' },
      { id: 'hero2', url: '/assets/images/hero 2.png', label: 'Twilight Villa', position: 'center 42%' },
      { id: 'hero3', url: '/assets/images/hero3.jpeg', label: 'AlGhaf Tree Pavilion', position: '65% 50%' },
    ],
  },
  {
    pageSlug: 'home',
    sectionId: 'home-origin',
    sectionName: 'Origin & Philosophy Story',
    thumbnailUrl: '/assets/images/about_bg.png',
    eyebrow: 'THE ALGHAF PHILOSOPHY',
    title: 'Rooted\nin the UAE.',
    subtitle: 'PEOPLE • PLACE • A BRIGHTER TOMORROW',
    content:
      'Inspired by the resilience of the UAE’s Ghaf tree, two Emirati women envisioned smarter, more sustainable homes. Combining their vision with the design, prefabrication, and modular construction expertise of CK Living Concepts, Al Ghaf Collective was born.',
    mediaUrl: '/assets/images/about_bg.png',
    mediaType: 'image',
    ctaText: 'READ OUR STORY',
    ctaUrl: '/about',
    displayOrder: 2,
    isVisible: true,
    status: 'published',
    items: [],
  },
  {
    pageSlug: 'home',
    sectionId: 'home-philosophy',
    sectionName: 'Core Idea & 4 Pillars',
    thumbnailUrl: '/assets/images/ax.jpg',
    eyebrow: 'Core Idea',
    title: 'FROM PROJECT TO PRODUCT.',
    subtitle: 'We are transforming housing from a fragmented project into a designed, engineered, and continuously refined product.',
    content: 'Instead of starting from zero every time, we design for manufacturing and assembly from day one.',
    displayOrder: 3,
    isVisible: true,
    status: 'published',
    items: [
      {
        number: '01',
        title: 'Comfort',
        subtitle: 'Responsive to living',
        description: 'Thermal insulation, acoustic privacy, natural airflow, and daylight optimization engineered into every module.',
        icon: 'Sparkles',
      },
      {
        number: '02',
        title: 'Quality',
        subtitle: 'Engineered with precision',
        description: 'Precision manufacturing in quality-controlled factory conditions ensures consistency that on-site building simply cannot match.',
        icon: 'ShieldCheck',
      },
      {
        number: '03',
        title: 'Speed',
        subtitle: 'Delivered months faster',
        description: 'Parallel site preparation and off-site manufacturing cut overall project delivery timelines by up to 50% compared to traditional builds.',
        icon: 'Zap',
      },
      {
        number: '04',
        title: 'Value',
        subtitle: 'Cost & lifecycle smart',
        description: 'Minimized construction waste, predictable costs, fixed timelines, and high energy efficiency deliver higher lifetime value for your property.',
        icon: 'Compass',
      },
    ],
  },
  {
    pageSlug: 'home',
    sectionId: 'home-process',
    sectionName: 'How We Build (Process & Video)',
    thumbnailUrl: '/assets/images/hero 2.png',
    eyebrow: 'How We Build: Step by Step',
    title: 'How We Build',
    subtitle: 'Smarter by design, off-site by manufacture, integrated on-site.',
    videoUrl: '/assets/videos/WhatsApp Video 2026-03-31 at 12.39.29 AM.mp4',
    mediaUrl: '/assets/images/hero 2.png',
    mediaType: 'video',
    ctaText: 'Discover Our Full Process',
    ctaUrl: '/process',
    displayOrder: 4,
    isVisible: true,
    status: 'published',
    items: [
      {
        number: '01',
        title: 'Design Smarter.',
        description: 'Architecture, planning and BIM for spaces that are functional, beautiful and future-ready.',
        icon: 'blueprint',
      },
      {
        number: '02',
        title: 'Prefabricate Precisely.',
        description: 'Controlled manufacturing with rigorous quality standards, reducing waste and project time.',
        icon: 'factory',
      },
      {
        number: '03',
        title: 'Build Modular.',
        description: 'On-site assembly with precision and minimal disruption, delivering spaces that last.',
        icon: 'crane',
      },
    ],
  },
  {
    pageSlug: 'home',
    sectionId: 'home-products',
    sectionName: 'Products Showcase (MOVA, PENTA, ENTRA)',
    thumbnailUrl: '/assets/renders/MOVA_EXT_3D_img1.jpg',
    eyebrow: 'OUR PRODUCTS',
    title: 'DESIGNED AS A PRODUCT. BUILT FOR LIVING.',
    subtitle: 'Not just a better way to build. A new way to think about housing.',
    ctaText: 'View All Product Specifications',
    ctaUrl: '/products',
    displayOrder: 5,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'mova',
        name: 'MOVA',
        category: 'Modular Living',
        tagline: 'One System. Endless Possibilities.',
        shortDescription: 'A versatile modular building system engineered to create adaptable, high-quality architectural spaces with greater speed, efficiency, and climate control.',
        heroImage: '/assets/renders/MOVA_EXT_3D_img1.jpg',
        slug: 'mova',
      },
      {
        id: 'penta',
        name: 'PENTA',
        category: 'Luxury Architectural Living',
        tagline: 'Designed to Stand Apart. Built to Perform.',
        shortDescription: 'AlGhaf Collective’s signature premium collection featuring double-height living spaces, mezzanine architecture, and bespoke craftsmanship.',
        heroImage: '/assets/images/imgupscaler-enhanced-7.jpg',
        slug: 'penta',
      },
      {
        id: 'entra',
        name: 'ENTRA',
        category: 'Private Entertainment',
        tagline: 'Your Space. Your Experience.',
        shortDescription: 'An immersive, acoustically engineered entertainment space designed for private cinema, gaming, social hospitality, and luxury events.',
        heroImage: '/assets/renders/CINE_EXT_3D_img1.jpg',
        slug: 'entra',
      },
    ],
  },
  {
    pageSlug: 'home',
    sectionId: 'home-applications',
    sectionName: 'Applications Overview (Bento)',
    thumbnailUrl: '/assets/images/built_more_than_homes_01_web.jpg',
    eyebrow: 'TYPOLOGIES & SCENARIOS',
    title: 'Built For More Than Homes.',
    subtitle: 'Engineered for private residences, luxury eco-resorts, farm estates, and wellness pavilions.',
    displayOrder: 6,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'modular-homes',
        title: 'Modular Homes & Private Residences',
        category: 'Residential',
        image: '/assets/images/built_more_than_homes_01_web.jpg',
        link: '/applications/modular-homes',
      },
      {
        id: 'hospitality-resorts',
        title: 'Hospitality & Boutique Resorts',
        category: 'Hospitality',
        image: '/assets/images/built_more_than_homes_02_web.jpg',
        link: '/applications/hospitality',
      },
      {
        id: 'farm-living-estates',
        title: 'Farm Living & Desert Ranches',
        category: 'Residential & Agriculture',
        image: '/assets/images/built_more_than_homes_03_web.jpg',
        link: '/applications/farm-living',
      },
      {
        id: 'eco-developments',
        title: 'Eco Retreats & Nature Escapes',
        category: 'Hospitality & Wellness',
        image: '/assets/images/built_more_than_homes_04_web.jpg',
        link: '/applications/eco-retreats',
      },
    ],
  },
  {
    pageSlug: 'home',
    sectionId: 'home-closing',
    sectionName: 'Closing Hero & Statement',
    thumbnailUrl: '/assets/images/imgupscaler-enhanced-4.jpg',
    eyebrow: 'Closing Statement',
    title: 'Live Better.',
    subtitle: '',
    content:
      'Everything we design and build begins with one purpose — to improve the way people live. We bring architecture, technology, nature, and human experience together to create spaces that are smarter, more comfortable, and more sustainable.',
    mediaUrl: '/assets/images/imgupscaler-enhanced-4.jpg',
    mediaType: 'image',
    ctaText: 'Enquire Now',
    ctaUrl: '#enquiry',
    displayOrder: 7,
    isVisible: true,
    status: 'published',
  },
];

async function seed() {
  try {
    await mongoose.connect(uri, { tls: true, tlsAllowInvalidCertificates: true, serverSelectionTimeoutMS: 8000 });
    console.log('Connected to MongoDB Atlas!');
    const Section = mongoose.connection.collection('sections');

    for (const sec of ALL_HOME_SECTIONS) {
      // Upsert: If document already exists, don't overwrite user edits for hero/origin, but update or insert missing fields
      const existing = await Section.findOne({ pageSlug: 'home', sectionId: sec.sectionId });
      if (existing) {
        console.log(`Section "${sec.sectionId}" exists in MongoDB. Preserving existing edits.`);
      } else {
        await Section.insertOne({
          ...sec,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Inserted missing section "${sec.sectionId}" into MongoDB.`);
      }
    }

    // Also remove obsolete home-process-intro if present so it doesn't duplicate
    await Section.deleteOne({ pageSlug: 'home', sectionId: 'home-process-intro' });

    // Fetch the complete set of sections
    const finalDocs = await Section.find({ pageSlug: 'home' }).sort({ displayOrder: 1 }).toArray();
    console.log(`Total sections in MongoDB for home: ${finalDocs.length}`);

    // Update local JSON store
    const storePath = path.join(process.cwd(), 'src/data/cms_homepage_store.json');
    fs.writeFileSync(storePath, JSON.stringify(finalDocs, null, 2), 'utf8');
    console.log(`✅ Written ${finalDocs.length} sections to src/data/cms_homepage_store.json`);

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
