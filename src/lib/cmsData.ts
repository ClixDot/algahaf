import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import { Section } from '../models/Section';

export interface CmsSectionItem {
  _id?: string;
  pageSlug: string;
  sectionId: string;
  sectionName: string;
  thumbnailUrl?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaAlt?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  items?: Array<Record<string, any>>;
  isVisible: boolean;
  displayOrder: number;
  status: 'published' | 'draft';
  draftContent?: Record<string, any>;
  publishedAt?: string | Date;
  lastDraftAt?: string | Date;
  updatedAt?: string | Date;
}

export const DEFAULT_HOME_SECTIONS: CmsSectionItem[] = [
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
    sectionName: 'Our Origin & Heritage',
    thumbnailUrl: '/assets/images/bg img alghaf 1.jpg.jpeg',
    eyebrow: 'OUR ORIGIN / 01',
    title: 'Rooted\nin the UAE.',
    subtitle: 'PEOPLE • PLACE • A BRIGHTER TOMORROW',
    content:
      'Inspired by the resilience of the UAE’s Ghaf tree, two Emirati women envisioned smarter, more sustainable homes. Combining their vision with the design, prefabrication, and modular construction expertise of CK Living Concepts, Al Ghaf Collective was born.',
    mediaUrl: '/assets/images/bg img alghaf 1.jpg.jpeg',
    mediaType: 'image',
    ctaText: 'About Us',
    ctaUrl: '/about',
    displayOrder: 2,
    isVisible: true,
    status: 'published',
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
        heroEyebrow: 'APPLICATIONS — RESIDENTIAL',
        heroTitle: 'Modular Homes &\nPrivate Residences.',
        heroDesc: 'A UAE-rooted modular architecture and construction approach reimagining residential living through precision engineering and sustainable design.',
        detailHeroImage: '/assets/images/built_more_than_homes_01_web.jpg',
        originEyebrow: 'OUR RESIDENTIAL VISION',
        originHeadline: 'Harmonious Living. Built for the UAE.',
        storyParagraphs: [
          'The Ghaf tree has thrived in the UAE’s desert for generations — resilient and sustaining life in the harshest conditions. Inspired by that enduring spirit, AlGhaf modular residences are engineered to harmonize with the desert while delivering absolute luxury and thermal serenity.',
          'From primary luxury desert residences to estate guest pavilions and independent family annexes, our modular homes offer expansive double-height volumes, floor-to-ceiling desert-tested glass facades, cantilevered pergolas for natural solar shading, and bespoke interiors completed with turnkey precision.',
          'Bringing this vision together with the design, prefabrication, and modular construction expertise of CK Living Concepts, AlGhaf Collective delivers precision-engineered homes up to 50% faster than conventional on-site construction — fully customizable from 30 m² to 300 m².',
        ],
      },
      {
        id: 'hospitality-resorts',
        title: 'Hospitality & Boutique Resorts',
        category: 'Hospitality',
        image: '/assets/images/built_more_than_homes_02_web.jpg',
        link: '/applications/hospitality',
        heroEyebrow: 'APPLICATIONS — HOSPITALITY',
        heroTitle: 'Hospitality &\nBoutique Resorts.',
        heroDesc: 'Accelerated development for world-class guest sanctuaries deployed with minimal environmental disturbance in remote and pristine terrains.',
        detailHeroImage: '/assets/images/built_more_than_homes_02_web.jpg',
        originEyebrow: 'OUR HOSPITALITY VISION',
        originHeadline: 'Rapid Deployment for World-Class Destinations.',
        storyParagraphs: [
          'Empowering resort operators and developers to deploy luxury guest keys in remote or pristine terrains with minimal environmental disturbance. Deliver exceptional guest experiences months ahead of conventional construction schedules.',
          'Every boutique suite is acoustically isolated and pre-fitted with five-star finishes, offering repeatable, luxury-grade consistency across multiple keys with minimal on-site disruption to delicate natural ecosystems.',
          'With modular prefabrication by CK Living Concepts, opening timelines are compressed by up to 50%, enabling operators to welcome guests and generate revenue significantly faster.',
        ],
      },
      {
        id: 'farm-living-estates',
        title: 'Farm Living & Desert Ranches',
        category: 'Residential & Agriculture',
        image: '/assets/images/built_more_than_homes_03_web.jpg',
        link: '/applications/farm-living',
        heroEyebrow: 'APPLICATIONS — FARM & RANCH',
        heroTitle: 'Farm Living &\nDesert Ranches.',
        heroDesc: 'Modern architectural retreats tailored for agricultural estates, equestrian ranches, and private desert farms.',
        detailHeroImage: '/assets/images/built_more_than_homes_03_web.jpg',
        originEyebrow: 'OUR RANCH LIVING VISION',
        originHeadline: 'Harmonizing Architecture with Rural Serenity.',
        storyParagraphs: [
          'Modern architectural retreats tailored for agricultural estates, equestrian ranches, and desert farms. Designed to frame panoramic views, provide insulated comfort against day-and-night temperature swings, and blend harmoniously into rural surroundings.',
          'Generous shaded verandas and outdoor dining pergolas expand the usable living space, while dust-sealed multi-point fenestration and durable exterior materials withstand sand abrasion and harsh sun exposure.',
          'Engineered with off-grid compatibility and rapid factory assembly, AlGhaf delivers serene agricultural sanctuaries without disturbing active farm operations.',
        ],
      },
      {
        id: 'eco-developments',
        title: 'Eco Retreats & Nature Escapes',
        category: 'Hospitality & Wellness',
        image: '/assets/images/built_more_than_homes_04_web.jpg',
        link: '/applications/eco-retreats',
        heroEyebrow: 'APPLICATIONS — ECO RETREATS',
        heroTitle: 'Eco Retreats &\nNature Escapes.',
        heroDesc: 'Low-impact architectural pavilions designed for sensitive ecological locations, desert conservation reserves, and mountain hideaways.',
        detailHeroImage: '/assets/images/built_more_than_homes_04_web.jpg',
        originEyebrow: 'OUR ECOLOGICAL VISION',
        originHeadline: 'Light on the Land. Deeply Connected to Nature.',
        storyParagraphs: [
          'Low-impact architectural pavilions designed for sensitive ecological locations, desert conservation reserves, and mountain hideaways. Built with sustainable materials and compatible with off-grid solar and greywater systems.',
          'Lightweight foundation options leave natural topography undisturbed, while high solar reflectivity and passive natural ventilation ensure exceptional energy efficiency.',
          'Constructed with recyclable steel structural frames and non-toxic interior finishes, creating authentic nature escapes that honor the fragile desert ecosystem.',
        ],
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

export const DEFAULT_ABOUT_SECTIONS: CmsSectionItem[] = [
  {
    pageSlug: 'about',
    sectionId: 'about-hero',
    sectionName: 'About Hero Cinematic Banner',
    thumbnailUrl: '/assets/images/about_bg.png',
    eyebrow: 'ABOUT ALGHAF COLLECTIVE',
    title: 'Rooted in Nature.\nBuilt for Tomorrow.',
    subtitle:
      'A UAE-rooted modular architecture and construction company reimagining residential living through precision engineering and sustainable design.',
    mediaUrl: '/assets/images/about_bg.png',
    mediaType: 'image',
    displayOrder: 1,
    isVisible: true,
    status: 'published',
  },
  {
    pageSlug: 'about',
    sectionId: 'about-origin',
    sectionName: 'Our Origin Story',
    thumbnailUrl: '/assets/images/story-botanical.png',
    eyebrow: 'OUR ORIGIN',
    title: 'Rooted in the UAE.',
    content:
      'The Ghaf tree has thrived in the UAE’s desert for generations — deeply rooted, resilient, and sustaining life in the harshest conditions.\n\nInspired by that spirit, two Emirati women came together with a vision to rethink the way we build and create smarter, more sustainable homes.\n\nBringing this vision together with the design, prefabrication, and modular construction expertise of CK Living Concepts, AlGhaf Collective was born.',
    displayOrder: 2,
    isVisible: true,
    status: 'published',
  },
  {
    pageSlug: 'about',
    sectionId: 'about-stats',
    sectionName: 'Origin Metrics & Statistics',
    thumbnailUrl: '/assets/images/ax.jpg',
    eyebrow: 'PERFORMANCE BENCHMARKS',
    title: 'Precision by the Numbers',
    subtitle: '3 Metric Showcase Cards',
    displayOrder: 3,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'stat-1',
        number: '50%',
        title: 'Faster Delivery',
        description: 'Factory-controlled prefabrication compresses project timelines compared to conventional site construction.',
      },
      {
        id: 'stat-2',
        number: '1',
        title: 'Integrated System',
        description: 'Design, engineering, materials, and assembly consolidated under one single accountable team.',
      },
      {
        id: 'stat-3',
        number: '30–300 m²',
        title: 'Scalable Architecture',
        description: 'Versatile modular footprints engineered for enduring thermal comfort and desert durability.',
      },
    ],
  },
  {
    pageSlug: 'about',
    sectionId: 'about-philosophy',
    sectionName: 'Our Philosophy & Integrated Values',
    thumbnailUrl: '/assets/images/about us.png',
    eyebrow: 'OUR PHILOSOPHY',
    title: 'One Vision. One System.\nOne Accountable Team.',
    subtitle:
      'Traditional construction is fragmented. Between architects, engineers, contractors, suppliers and labour, designs change, costs shift, timelines move and the original vision can get lost.',
    content: 'AlGhaf Collective brings design, engineering, materials, prefabrication, construction and installation together under one integrated system.',
    mediaUrl: '/assets/images/about us.png',
    mediaType: 'image',
    displayOrder: 4,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'phil-1',
        title: 'Unified Accountability',
        description: 'Single-source ownership from initial sketch through turnkey handover eliminates client disputes.',
      },
      {
        id: 'phil-2',
        title: 'Millimeter-Level Precision',
        description: 'Industrial prefabrication in controlled factory conditions ensures flawless joinery and finishes.',
      },
      {
        id: 'phil-3',
        title: 'Schedule & Cost Certainty',
        description: 'Fixed contracts and systematic engineering protect budgets against unpredictable site variations.',
      },
    ],
  },
  {
    pageSlug: 'about',
    sectionId: 'about-office',
    sectionName: 'Main Office & Interactive Map',
    thumbnailUrl: '/assets/images/imgupscaler-enhanced-7.jpg',
    eyebrow: 'Main office',
    title: 'Come visit our office',
    subtitle: 'Dubai Design District (d3)',
    content:
      "Stop by our office to meet the team, discuss your plans, and explore the best modular architecture solutions. We'll be happy to answer your questions and help you find the right place to call home.",
    mediaUrl: '/assets/images/imgupscaler-enhanced-7.jpg',
    mediaType: 'image',
    videoUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.428489814526!2d55.2954752!3d25.1861054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f68307d896173%3A0xe54d924192b6a555!2sDubai%20Design%20District!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae',
    ctaText: 'Contacts',
    ctaUrl: '/contact',
    items: [
      {
        id: 'office-card',
        title: 'Dubai Design District (d3)',
        subtitle: 'Building 7, Dubai\nUnited Arab Emirates',
        image: '/assets/images/imgupscaler-enhanced-7.jpg',
        link: '/contact',
      },
    ],
    displayOrder: 5,
    isVisible: true,
    status: 'published',
  },
  {
    pageSlug: 'about',
    sectionId: 'about-closing',
    sectionName: 'Closing CTA (Start a Conversation)',
    thumbnailUrl: '/assets/images/about_bg.png',
    eyebrow: "LET'S BUILD SOMETHING BETTER.",
    title: 'Start a Conversation.',
    content:
      'Whether you are planning a private home, hospitality development, modular project, or looking to collaborate, start the conversation with us.',
    ctaText: 'START YOUR PROJECT',
    ctaUrl: '/contact',
    displayOrder: 6,
    isVisible: true,
    status: 'published',
  },
];

export const DEFAULT_PRODUCTS_SECTIONS: CmsSectionItem[] = [
  {
    pageSlug: 'products',
    sectionId: 'products-hero',
    sectionName: 'Products Hero Cinematic Banner',
    thumbnailUrl: '/assets/images/products.png',
    eyebrow: 'MODULAR PRODUCT SYSTEMS',
    title: 'Not Just Modular.\nDesigned as Products.',
    subtitle:
      'A new generation of architectural spaces developed through integrated design, precision engineering, climate-controlled prefabrication, and rapid turnkey installation.',
    mediaUrl: '/assets/images/products.png',
    mediaType: 'image',
    displayOrder: 1,
    isVisible: true,
    status: 'published',
  },
  {
    pageSlug: 'products',
    sectionId: 'products-catalog',
    sectionName: 'Architectural Catalog Overview',
    thumbnailUrl: '/assets/images/ax.jpg',
    eyebrow: 'Architectural Catalog',
    title: 'Three Distinct Collections.',
    subtitle: 'Engineered around human experience, structural permanence, and climate resilience.',
    displayOrder: 2,
    isVisible: true,
    status: 'published',
  },
  {
    pageSlug: 'products',
    sectionId: 'products-mova',
    sectionName: 'MOVA Product Showcase Card',
    thumbnailUrl: '/assets/renders/MOVA_EXT_3D_img1.jpg',
    eyebrow: 'MODULAR LIVING',
    title: 'MOVA',
    subtitle: 'Modular Optimized Versatile Architecture',
    content:
      'A versatile modular building system engineered to create adaptable, high-quality architectural spaces with greater speed, efficiency, and climate control.',
    mediaUrl: '/assets/renders/MOVA_EXT_3D_img1.jpg',
    mediaType: 'image',
    mediaAlt: 'MOVA Modular Living System',
    ctaText: 'View Complete Details & Plans',
    ctaUrl: '/products/mova',
    displayOrder: 3,
    isVisible: true,
    status: 'published',
    items: [
      { id: 'lead', title: 'Lead Time', subtitle: '6–10 Weeks' },
      { id: 'tagline', title: 'Tagline', subtitle: 'One System. Endless Possibilities.' },
      { id: 'h1', title: 'Thermal Performance' },
      { id: 'h2', title: 'Acoustic Comfort' },
      { id: 'h3', title: 'Desert Durability' },
      { id: 'h4', title: 'Factory Precision' },
    ],
  },
  {
    pageSlug: 'products',
    sectionId: 'products-penta',
    sectionName: 'PENTA Product Showcase Card',
    thumbnailUrl: '/assets/images/imgupscaler-enhanced-7.jpg',
    eyebrow: 'LUXURY ARCHITECTURAL LIVING',
    title: 'PENTA',
    subtitle: 'Elevated Modular Living',
    content:
      'AlGhaf Collective’s signature premium collection featuring double-height living spaces, mezzanine architecture, and bespoke craftsmanship.',
    mediaUrl: '/assets/images/imgupscaler-enhanced-7.jpg',
    mediaType: 'image',
    mediaAlt: 'PENTA Elevated Modular Living',
    ctaText: 'View Complete Details & Plans',
    ctaUrl: '/products/penta',
    displayOrder: 4,
    isVisible: true,
    status: 'published',
    items: [
      { id: 'lead', title: 'Lead Time', subtitle: '8–14 Weeks' },
      { id: 'tagline', title: 'Tagline', subtitle: 'Designed to Stand Apart. Built to Perform.' },
      { id: 'h1', title: 'Double-Height Volume' },
      { id: 'h2', title: 'Mezzanine Sanctuary' },
      { id: 'h3', title: 'Architectural Glazing' },
      { id: 'h4', title: 'Integrated Culinary Suite' },
    ],
  },
  {
    pageSlug: 'products',
    sectionId: 'products-entra',
    sectionName: 'ENTRA Product Showcase Card',
    thumbnailUrl: '/assets/renders/CINE_EXT_3D_img1.jpg',
    eyebrow: 'PRIVATE ENTERTAINMENT',
    title: 'ENTRA',
    subtitle: 'Private Entertainment. Reimagined.',
    content:
      'An immersive, acoustically engineered entertainment space designed for private cinema, gaming, social hospitality, and luxury events.',
    mediaUrl: '/assets/renders/CINE_EXT_3D_img1.jpg',
    mediaType: 'image',
    mediaAlt: 'ENTRA Private Entertainment',
    ctaText: 'View Complete Details & Plans',
    ctaUrl: '/products/entra',
    displayOrder: 5,
    isVisible: true,
    status: 'published',
    items: [
      { id: 'lead', title: 'Lead Time', subtitle: '6–10 Weeks' },
      { id: 'tagline', title: 'Tagline', subtitle: 'Your Space. Your Experience.' },
      { id: 'h1', title: 'Acoustic Art Wallcover' },
      { id: 'h2', title: 'Cinema-Grade Visuals' },
      { id: 'h3', title: 'Dolby Atmos Integration' },
      { id: 'h4', title: 'Bespoke Lighting Scenes' },
    ],
  },
  {
    pageSlug: 'products',
    sectionId: 'products-comparison',
    sectionName: 'System Specifications Comparison Matrix',
    thumbnailUrl: '/assets/images/ax.jpg',
    eyebrow: 'SYSTEM COMPARISON',
    title: 'Compare AlGhaf Collections.',
    subtitle: 'Understand dimensions, ceiling volumes, and structural attributes side by side.',
    displayOrder: 6,
    isVisible: true,
    status: 'published',
    items: [
      { id: 'c1', attr: 'Footprint Range', mova: '30 m² to 75 m²', penta: '50 m² to 300 m²', entra: '3 Standard Sizes' },
      { id: 'c2', attr: 'Architectural Typology', mova: 'Single-Level Modular Studio / Villa', penta: 'Signature Double-Height & Mezzanine', entra: 'Private Immersive Acoustic Suite' },
      { id: 'c3', attr: 'Clear Ceiling Height', mova: '2.8m – 3.2m', penta: 'Up to 5.6m Void / 2.7m Mezzanine', entra: '3.0m Acoustic Ceiling' },
      { id: 'c4', attr: 'Primary Purpose', mova: 'Homes, Studios, Majlis, Offices', penta: 'Luxury Residences, Retreats, Villas', entra: 'Cinema, Gaming, Social, Bar' },
      { id: 'c5', attr: 'Acoustic Insulation', mova: 'Desert Climate Acoustic Barrier', penta: 'STC 55+ Envelope Rating', entra: 'Laboratory-Tuned STC 60+' },
      { id: 'c6', attr: 'Turnkey Lead Time', mova: '6–10 Weeks', penta: '8–14 Weeks', entra: '6–8 Weeks' },
    ],
  },
];

export const DEFAULT_APPLICATIONS_SECTIONS: CmsSectionItem[] = [
  {
    pageSlug: 'applications',
    sectionId: 'applications-hero',
    sectionName: 'Applications Hero Banner',
    thumbnailUrl: '/assets/images/image_bg_alghaf222.jpg',
    eyebrow: 'COMING SOON — ACTIVE CURATION',
    title: 'Built For More Than Homes.',
    subtitle:
      'From private desert residences and luxury eco-resorts to agricultural farm retreats, wellness pavilions, and entertainment suites.',
    content:
      'From private desert residences and luxury eco-resorts to agricultural farm retreats, wellness pavilions, and entertainment suites.',
    mediaUrl: '/assets/images/image_bg_alghaf222.jpg',
    mediaType: 'image',
    mediaAlt: 'Built For More Than Homes - AlGhaf Applications',
    displayOrder: 1,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'hero-styling',
        overlayColor: '#0E100E',
        overlayOpacity: 0.82,
        textAlign: 'center',
        contentWidth: '880px',
        heroHeight: 'clamp(520px, 62vh, 700px)',
      },
    ],
  },
  {
    pageSlug: 'applications',
    sectionId: 'applications-categories',
    sectionName: 'Application Categories & Filters',
    thumbnailUrl: '/assets/images/ax.jpg',
    eyebrow: 'DYNAMIC CATEGORY FILTERS',
    title: 'Application Categories & Filters',
    subtitle: 'Manage filter chips and category groupings for the catalog',
    displayOrder: 2,
    isVisible: true,
    status: 'published',
    items: [
      { id: 'cat-all', name: 'All', slug: 'all', order: 0, isVisible: true, isLocked: true },
      { id: 'cat-residential', name: 'Residential', slug: 'residential', order: 1, isVisible: true },
      { id: 'cat-hospitality', name: 'Hospitality', slug: 'hospitality', order: 2, isVisible: true },
      { id: 'cat-wellness', name: 'Wellness', slug: 'wellness', order: 3, isVisible: true },
      { id: 'cat-specialized', name: 'Specialized', slug: 'specialized', order: 4, isVisible: true },
    ],
  },
  {
    pageSlug: 'applications',
    sectionId: 'applications-cards',
    sectionName: 'Application Cards Catalog',
    thumbnailUrl: '/assets/images/built_more_than_homes_01_web.jpg',
    eyebrow: 'PORTFOLIO OF 6 CORE TYPOLOGIES',
    title: 'Application Cards & Architectural Typologies',
    subtitle: 'Complete CRUD management for individual application cards',
    displayOrder: 3,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'modular-homes',
        title: 'Modular Homes & Private Residences',
        category: 'Residential',
        categories: ['Residential'],
        tagline: 'Architecture designed for mindful modern living.',
        description:
          'From primary luxury residences to estate guest pavilions and independent family annexes. AlGhaf modular homes offer expansive double-height volumes, floor-to-ceiling desert-tested glass facades, and bespoke interiors completed with turnkey precision.',
        detailedDescription:
          'The Ghaf tree has thrived in the UAE’s desert for generations — resilient and sustaining life in the harshest conditions. Inspired by that enduring spirit, AlGhaf modular residences are engineered to harmonize with the desert while delivering absolute luxury and thermal serenity.',
        recommendedProducts: ['PENTA', 'MOVA'],
        compatibility: ['PENTA', 'MOVA'],
        image: '/assets/images/built_more_than_homes_01_web.jpg',
        imageAlt: 'Modular Homes & Private Residences',
        imagePosition: 'center center',
        heroEyebrow: 'APPLICATIONS — RESIDENTIAL',
        heroTitle: 'Modular Homes &\nPrivate Residences.',
        heroDesc: 'A UAE-rooted modular architecture and construction approach reimagining residential living through precision engineering and sustainable design.',
        detailHeroImage: '/assets/images/built_more_than_homes_01_web.jpg',
        originEyebrow: 'OUR RESIDENTIAL VISION',
        originHeadline: 'Harmonious Living. Built for the UAE.',
        storyParagraphs: [
          'The Ghaf tree has thrived in the UAE’s desert for generations — resilient and sustaining life in the harshest conditions. Inspired by that enduring spirit, AlGhaf modular residences are engineered to harmonize with the desert while delivering absolute luxury and thermal serenity.',
          'From primary luxury desert residences to estate guest pavilions and independent family annexes, our modular homes offer expansive double-height volumes, floor-to-ceiling desert-tested glass facades, cantilevered pergolas for natural solar shading, and bespoke interiors completed with turnkey precision.',
          'Bringing this vision together with the design, prefabrication, and modular construction expertise of CK Living Concepts, AlGhaf Collective delivers precision-engineered homes up to 50% faster than conventional on-site construction — fully customizable from 30 m² to 300 m².',
        ],
        overviewBtnText: 'Overview',
        overviewUrl: '/applications/modular-homes',
        overviewOpenNewTab: false,
        enquireBtnText: 'Enquire',
        enquireUrl: '#enquiry',
        showButtons: true,
        order: 1,
        isVisible: true,
        status: 'published',
      },
      {
        id: 'hospitality',
        title: 'Hospitality & Boutique Resorts',
        category: 'Hospitality',
        categories: ['Hospitality'],
        tagline: 'Accelerated development for world-class guest sanctuaries.',
        description:
          'Empowering resort operators and developers to deploy luxury guest keys in remote or pristine terrains with minimal environmental disturbance. Deliver exceptional guest experiences months ahead of conventional construction schedules.',
        detailedDescription:
          'Every boutique suite is acoustically isolated and pre-fitted with five-star finishes, offering repeatable, luxury-grade consistency across multiple keys with minimal on-site disruption to delicate natural ecosystems.',
        recommendedProducts: ['PENTA', 'MOVA', 'ENTRA'],
        compatibility: ['PENTA', 'MOVA', 'ENTRA'],
        image: '/assets/images/built_more_than_homes_02_web.jpg',
        imageAlt: 'Hospitality & Boutique Resorts',
        imagePosition: 'center center',
        heroEyebrow: 'APPLICATIONS — HOSPITALITY',
        heroTitle: 'Hospitality &\nBoutique Resorts.',
        heroDesc: 'Accelerated development for world-class guest sanctuaries deployed with minimal environmental disturbance in remote and pristine terrains.',
        detailHeroImage: '/assets/images/built_more_than_homes_02_web.jpg',
        originEyebrow: 'OUR HOSPITALITY VISION',
        originHeadline: 'Rapid Deployment for World-Class Destinations.',
        storyParagraphs: [
          'Empowering resort operators and developers to deploy luxury guest keys in remote or pristine terrains with minimal environmental disturbance. Deliver exceptional guest experiences months ahead of conventional construction schedules.',
          'Every boutique suite is acoustically isolated and pre-fitted with five-star finishes, offering repeatable, luxury-grade consistency across multiple keys with minimal on-site disruption to delicate natural ecosystems.',
          'With modular prefabrication by CK Living Concepts, opening timelines are compressed by up to 50%, enabling operators to welcome guests and generate revenue significantly faster.',
        ],
        overviewBtnText: 'Overview',
        overviewUrl: '/applications/hospitality',
        overviewOpenNewTab: false,
        enquireBtnText: 'Enquire',
        enquireUrl: '#enquiry',
        showButtons: true,
        order: 2,
        isVisible: true,
        status: 'published',
      },
      {
        id: 'farm-living',
        title: 'Farm Living & Desert Ranches',
        category: 'Residential',
        categories: ['Residential'],
        tagline: 'Sanctuaries of calm set amidst agricultural landscapes.',
        description:
          'Modern architectural retreats tailored for agricultural estates, equestrian ranches, and desert farms. Designed to frame panoramic views, provide insulated comfort against day-and-night temperature swings, and blend harmoniously into rural surroundings.',
        detailedDescription:
          'Generous shaded verandas and outdoor dining pergolas expand the usable living space, while dust-sealed multi-point fenestration and durable exterior materials withstand sand abrasion and harsh sun exposure.',
        recommendedProducts: ['MOVA', 'PENTA'],
        compatibility: ['MOVA', 'PENTA'],
        image: '/assets/images/built_more_than_homes_03_web.jpg',
        imageAlt: 'Farm Living & Desert Ranches',
        imagePosition: 'center center',
        heroEyebrow: 'APPLICATIONS — FARM & RANCH',
        heroTitle: 'Farm Living &\nDesert Ranches.',
        heroDesc: 'Modern architectural retreats tailored for agricultural estates, equestrian ranches, and private desert farms.',
        detailHeroImage: '/assets/images/built_more_than_homes_03_web.jpg',
        originEyebrow: 'OUR RANCH LIVING VISION',
        originHeadline: 'Harmonizing Architecture with Rural Serenity.',
        storyParagraphs: [
          'Modern architectural retreats tailored for agricultural estates, equestrian ranches, and desert farms. Designed to frame panoramic views, provide insulated comfort against day-and-night temperature swings, and blend harmoniously into rural surroundings.',
          'Generous shaded verandas and outdoor dining pergolas expand the usable living space, while dust-sealed multi-point fenestration and durable exterior materials withstand sand abrasion and harsh sun exposure.',
          'Engineered with off-grid compatibility and rapid factory assembly, AlGhaf delivers serene agricultural sanctuaries without disturbing active farm operations.',
        ],
        overviewBtnText: 'Overview',
        overviewUrl: '/applications/farm-living',
        overviewOpenNewTab: false,
        enquireBtnText: 'Enquire',
        enquireUrl: '#enquiry',
        showButtons: true,
        order: 3,
        isVisible: true,
        status: 'published',
      },
      {
        id: 'eco-retreats',
        title: 'Eco Retreats & Nature Escapes',
        category: 'Hospitality',
        categories: ['Hospitality', 'Wellness'],
        tagline: 'Light on the land, deeply connected to nature.',
        description:
          'Low-impact architectural pavilions designed for sensitive ecological locations, desert conservation reserves, and mountain hideaways. Built with sustainable materials and compatible with off-grid solar and greywater systems.',
        detailedDescription:
          'Lightweight foundation options leave natural topography undisturbed, while high solar reflectivity and passive natural ventilation ensure exceptional energy efficiency.',
        recommendedProducts: ['MOVA', 'PENTA'],
        compatibility: ['MOVA', 'PENTA'],
        image: '/assets/images/built_more_than_homes_04_web.jpg',
        imageAlt: 'Eco Retreats & Nature Escapes',
        imagePosition: 'center center',
        heroEyebrow: 'APPLICATIONS — ECO RETREATS',
        heroTitle: 'Eco Retreats &\nNature Escapes.',
        heroDesc: 'Low-impact architectural pavilions designed for sensitive ecological locations, desert conservation reserves, and mountain hideaways.',
        detailHeroImage: '/assets/images/built_more_than_homes_04_web.jpg',
        originEyebrow: 'OUR ECOLOGICAL VISION',
        originHeadline: 'Light on the Land. Deeply Connected to Nature.',
        storyParagraphs: [
          'Low-impact architectural pavilions designed for sensitive ecological locations, desert conservation reserves, and mountain hideaways. Built with sustainable materials and compatible with off-grid solar and greywater systems.',
          'Lightweight foundation options leave natural topography undisturbed, while high solar reflectivity and passive natural ventilation ensure exceptional energy efficiency.',
          'Constructed with recyclable steel structural frames and non-toxic interior finishes, creating authentic nature escapes that honor the fragile desert ecosystem.',
        ],
        overviewBtnText: 'Overview',
        overviewUrl: '/applications/eco-retreats',
        overviewOpenNewTab: false,
        enquireBtnText: 'Enquire',
        enquireUrl: '#enquiry',
        showButtons: true,
        order: 4,
        isVisible: true,
        status: 'published',
      },
      {
        id: 'entertainment-social',
        title: 'Private Entertainment & Media Lounges',
        category: 'Specialized',
        categories: ['Specialized'],
        tagline: 'A private immersive audio-visual environment.',
        description:
          'Standalone entertainment pavilions engineered to studio recording criteria. Created for immersive cinema, esports gaming, musical performance, and social hosting, equipped with optional bar and luxury restroom modules.',
        detailedDescription:
          'Laboratory-calibrated acoustic treatment and STC 60+ isolation guarantee complete sound containment, while integrated 4K laser projection framing and Dolby Atmos conduits deliver supreme audiovisual performance.',
        recommendedProducts: ['ENTRA'],
        compatibility: ['ENTRA'],
        image: '/assets/renders/CINE_EXT_3D_img1.jpg',
        imageAlt: 'Private Entertainment & Media Lounges',
        imagePosition: 'center center',
        heroEyebrow: 'APPLICATIONS — SPECIALIZED',
        heroTitle: 'Private Entertainment &\nMedia Lounges.',
        heroDesc: 'Standalone entertainment pavilions engineered to studio recording criteria for immersive cinema, gaming, and social hosting.',
        detailHeroImage: '/assets/renders/CINE_EXT_3D_img1.jpg',
        originEyebrow: 'OUR ENTERTAINMENT VISION',
        originHeadline: 'A Private Immersive Acoustic Sanctuary.',
        storyParagraphs: [
          'Standalone entertainment pavilions engineered to studio recording criteria. Created for immersive cinema, esports gaming, musical performance, and social hosting, equipped with optional bar and luxury restroom modules.',
          'Laboratory-calibrated acoustic treatment and STC 60+ isolation guarantee complete sound containment, while integrated 4K laser projection framing and Dolby Atmos conduits deliver supreme audiovisual performance.',
          'Prefabricated with turnkey precision, each entertainment pavilion arrives ready for plug-and-play operation without the noise and disruption of site remodeling.',
        ],
        overviewBtnText: 'Overview',
        overviewUrl: '/applications/entertainment-social',
        overviewOpenNewTab: false,
        enquireBtnText: 'Enquire',
        enquireUrl: '#enquiry',
        showButtons: true,
        order: 5,
        isVisible: true,
        status: 'published',
      },
      {
        id: 'wellness-retreat',
        title: 'Wellness Pavilions & Private Gyms',
        category: 'Wellness',
        categories: ['Wellness'],
        tagline: 'Dedicated sanctuaries for personal wellbeing and vitality.',
        description:
          'Private yoga pavilions, thermal saunas, personal fitness training suites, and meditation sanctuaries situated in private gardens or resort grounds, filled with natural daylight and peaceful acoustic calm.',
        detailedDescription:
          'Featuring reinforced floor load capacities for heavy fitness equipment, moisture-controlled fresh air ventilation systems, and expansive timber-slatted acoustic feature walls.',
        recommendedProducts: ['MOVA'],
        compatibility: ['MOVA'],
        image: '/assets/images/imgupscaler-enhanced-6.jpg',
        imageAlt: 'Wellness Pavilions & Private Gyms',
        imagePosition: 'center center',
        heroEyebrow: 'APPLICATIONS — WELLNESS',
        heroTitle: 'Wellness Pavilions &\nPrivate Gyms.',
        heroDesc: 'Dedicated sanctuaries for personal wellbeing, thermal saunas, private fitness suites, and meditation retreats.',
        detailHeroImage: '/assets/images/imgupscaler-enhanced-6.jpg',
        originEyebrow: 'OUR WELLNESS VISION',
        originHeadline: 'Restorative Spaces for Vitality and Peace.',
        storyParagraphs: [
          'Private yoga pavilions, thermal saunas, personal fitness training suites, and meditation sanctuaries situated in private gardens or resort grounds, filled with natural daylight and peaceful acoustic calm.',
          'Featuring reinforced floor load capacities for heavy fitness equipment, moisture-controlled fresh air ventilation systems, and expansive timber-slatted acoustic feature walls.',
          'Designed to create a seamless extension of mindful living, each wellness module provides a private oasis of health and rejuvenation.',
        ],
        overviewBtnText: 'Overview',
        overviewUrl: '/applications/wellness-retreat',
        overviewOpenNewTab: false,
        enquireBtnText: 'Enquire',
        enquireUrl: '#enquiry',
        showButtons: true,
        order: 6,
        isVisible: true,
        status: 'published',
      },
    ],
  },
  {
    pageSlug: 'applications',
    sectionId: 'applications-closing',
    sectionName: 'Closing Project Consultation CTA',
    thumbnailUrl: '/assets/images/about_bg.png',
    eyebrow: 'BESPOKE TYPOLOGIES & MASTERPLANS',
    title: 'Have a Unique Architectural Requirement?',
    subtitle:
      'Our prefabrication engineers collaborate with private landowners, hoteliers, and developers across the UAE and GCC.',
    content:
      'From single private pavilions to masterplanned luxury resort keys, AlGhaf delivers turnkey modular architecture with uncompromising quality.',
    ctaText: 'Start a Consultation',
    ctaUrl: '/contact',
    mediaUrl: '/assets/images/about_bg.png',
    mediaType: 'image',
    displayOrder: 4,
    isVisible: true,
    status: 'published',
  },
];

export const DEFAULT_CONTACT_SECTIONS: CmsSectionItem[] = [
  {
    pageSlug: 'contact',
    sectionId: 'contact-hero',
    sectionName: 'Contact Hero',
    thumbnailUrl: '/assets/images/image_bg_more_alghafdfdfd.jpg',
    eyebrow: 'Start Your Project',
    title: "Let's Build\nSomething Better.",
    subtitle:
      'Whether you are planning a private home, hospitality development, modular project, or looking to collaborate, start the conversation with us.',
    content:
      'Whether you are planning a private home, hospitality development, modular project, or looking to collaborate, start the conversation with us.',
    mediaUrl: '/assets/images/image_bg_more_alghafdfdfd.jpg',
    mediaType: 'image',
    displayOrder: 1,
    isVisible: true,
    status: 'published',
  },
  {
    pageSlug: 'contact',
    sectionId: 'contact-direct',
    sectionName: 'Direct Contact & Information Cards',
    thumbnailUrl: '/assets/images/ax.jpg',
    eyebrow: 'Direct Contact',
    title: 'Connect With Our Team.',
    subtitle:
      'Speak directly with our architectural directors and prefabrication specialists. We welcome consultations for private landowners, hospitality developers, and master planners.',
    content:
      'Speak directly with our architectural directors and prefabrication specialists. We welcome consultations for private landowners, hospitality developers, and master planners.',
    mediaUrl: '/assets/images/ax.jpg',
    mediaType: 'image',
    displayOrder: 2,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'headquarters',
        type: 'headquarters',
        title: 'Headquarters',
        name: 'Headquarters',
        address: 'Dubai Design District (d3), Building 7, Dubai, United Arab Emirates',
        description: 'Dubai Design District (d3), Building 7, Dubai, United Arab Emirates',
        icon: 'MapPin',
        link: 'https://maps.google.com',
        isVisible: true,
      },
      {
        id: 'phone-whatsapp',
        type: 'phone',
        title: 'Telephone & WhatsApp',
        name: 'Telephone & WhatsApp',
        phone: '+971 4 288 9412',
        whatsapp: '+971 50 892 4110',
        phoneLabel: 'Main: +971 4 288 9412',
        whatsappLabel: 'WhatsApp: +971 50 892 4110',
        description: 'Main: +971 4 288 9412 | WhatsApp: +971 50 892 4110',
        icon: 'Phone',
        link: 'tel:+97142889412',
        isVisible: true,
      },
      {
        id: 'email',
        type: 'email',
        title: 'Inquiries Email',
        name: 'Inquiries Email',
        email: 'info@alghafcollective.ae',
        description: 'info@alghafcollective.ae',
        icon: 'Mail',
        link: 'mailto:info@alghafcollective.ae',
        isVisible: true,
      },
      {
        id: 'working-hours',
        type: 'hours',
        title: 'Working Hours',
        name: 'Working Hours',
        workingDays: 'Monday – Friday',
        workingHours: '9:00 AM – 6:00 PM',
        timeZone: 'GST',
        description: 'Monday – Friday: 9:00 AM – 6:00 PM GST',
        icon: 'Clock',
        isVisible: true,
      },
    ],
  },
  {
    pageSlug: 'contact',
    sectionId: 'contact-form',
    sectionName: 'Project Enquiry Form Builder',
    thumbnailUrl: '/assets/images/hero1.jpeg',
    eyebrow: 'Direct Consultation',
    title: 'Start Your Project',
    subtitle: 'Fill out the form below. Our architectural engineers will review your requirements.',
    content:
      'Thank you. Your enquiry has been logged. An AlGhaf project coordinator will be in touch within 24 business hours.',
    ctaText: 'Send Enquiry',
    displayOrder: 3,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'projectType',
        fieldKey: 'projectType',
        title: 'What are you interested in?',
        label: 'What are you interested in? *',
        type: 'select',
        required: true,
        order: 1,
        options: [
          'MOVA — Modular Optimized Versatile Architecture (30–75 m²)',
          'PENTA — Elevated Modular Living (50–300 m²)',
          'ENTRA — Private Entertainment. Reimagined',
          'Hospitality & Resort Key Development',
          'Commercial / Creative Office Suite',
          'Architectural / Developer Collaboration',
          'Other Bespoke Requirement',
        ],
      },
      {
        id: 'name',
        fieldKey: 'name',
        title: 'Full Name',
        label: 'Full Name *',
        placeholder: '',
        type: 'text',
        required: true,
        order: 2,
      },
      {
        id: 'company',
        fieldKey: 'company',
        title: 'Company',
        label: 'Company (Optional)',
        placeholder: '',
        type: 'text',
        required: false,
        order: 3,
      },
      {
        id: 'email',
        fieldKey: 'email',
        title: 'Email Address',
        label: 'Email Address *',
        placeholder: '',
        type: 'email',
        required: true,
        order: 4,
      },
      {
        id: 'phone',
        fieldKey: 'phone',
        title: 'Phone / WhatsApp',
        label: 'Phone / WhatsApp *',
        placeholder: '',
        type: 'tel',
        required: true,
        order: 5,
      },
      {
        id: 'location',
        fieldKey: 'location',
        title: 'Project Location',
        label: 'Project Location',
        type: 'select',
        required: false,
        order: 6,
        options: [
          'Dubai, UAE',
          'Abu Dhabi, UAE',
          'Sharjah, UAE',
          'Ras Al Khaimah, UAE',
          'Al Ain, UAE',
          'Other UAE Emirates',
          'Saudi Arabia (KSA)',
          'Other GCC Country',
        ],
      },
      {
        id: 'approximateSize',
        fieldKey: 'approximateSize',
        title: 'Approximate Size',
        label: 'Approximate Size',
        type: 'select',
        required: false,
        order: 7,
        options: [
          '30–50 m² (Studio / Suite)',
          '50–100 m² (1–2 Bedroom)',
          '100–200 m² (Villa Residence)',
          '200–300+ m² (Estate Compound)',
          'Multi-Unit Hospitality Keys',
        ],
      },
      {
        id: 'description',
        fieldKey: 'description',
        title: 'Tell Us About Your Project',
        label: 'Tell Us About Your Project *',
        placeholder: '',
        type: 'textarea',
        required: true,
        order: 8,
      },
    ],
  },
  {
    pageSlug: 'contact',
    sectionId: 'contact-faq',
    sectionName: 'Frequently Asked Questions (FAQ)',
    eyebrow: 'Questions & Clarity',
    title: 'Frequently Asked Questions.',
    subtitle: 'Understand how AlGhaf Collective structures approvals, delivery, and installation.',
    content: 'Understand how AlGhaf Collective structures approvals, delivery, and installation.',
    displayOrder: 4,
    isVisible: true,
    status: 'published',
    items: [
      {
        id: 'faq-1',
        title: 'Do AlGhaf modular homes comply with UAE municipal building regulations?',
        question: 'Do AlGhaf modular homes comply with UAE municipal building regulations?',
        answer:
          'Yes. All AlGhaf structural frames and building envelopes are engineered in full alignment with UAE building codes, Dubai Municipality regulations, and GCC civil defense fire safety standards.',
        category: '',
        order: 1,
        status: 'published',
        isVisible: true,
      },
      {
        id: 'faq-2',
        title: 'How long does the entire process take from agreement to handover?',
        question: 'How long does the entire process take from agreement to handover?',
        answer:
          'Standard modular delivery ranges from 6 to 14 weeks depending on the selected collection (MOVA: 6–10 weeks, PENTA: 8–14 weeks, ENTRA: 6–8 weeks). Because ground preparation and factory prefabrication run in parallel, on-site installation takes only 1 to 3 days.',
        category: 'Process & Timelines',
        order: 2,
        status: 'published',
        isVisible: true,
      },
      {
        id: 'faq-3',
        title: 'Can the interior layouts and finishes be customized?',
        question: 'Can the interior layouts and finishes be customized?',
        answer:
          'Yes. While structural chassis dimensions are standardized for optimal factory engineering and transport, all interior millwork, kitchen joinery, flooring materials, sanitary ware, and smart home controls can be personalized.',
        category: 'Design & Customization',
        order: 3,
        status: 'published',
        isVisible: true,
      },
      {
        id: 'faq-4',
        title: 'What site foundations are required for installation?',
        question: 'What site foundations are required for installation?',
        answer:
          'Our modular units can be installed on reinforced concrete strip footings, low-impact steel helical screw piles, or grade beams. Our engineering team conducts a thorough site evaluation before foundation works commence.',
        category: 'Engineering & Site Work',
        order: 4,
        status: 'published',
        isVisible: true,
      },
    ],
  },
];

const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'src', 'data');

function getLocalFile(pageSlug: string): string {
  const filename = pageSlug === 'home' ? 'cms_homepage_store.json' : `cms_${pageSlug}_store.json`;
  return path.join(LOCAL_STORAGE_DIR, filename);
}

function getDefaultSectionsForPage(pageSlug: string): CmsSectionItem[] {
  if (pageSlug === 'applications') return DEFAULT_APPLICATIONS_SECTIONS;
  if (pageSlug === 'contact') return DEFAULT_CONTACT_SECTIONS;
  if (pageSlug === 'products') return DEFAULT_PRODUCTS_SECTIONS;
  if (pageSlug === 'about') return DEFAULT_ABOUT_SECTIONS;
  if (pageSlug === 'home') return DEFAULT_HOME_SECTIONS;
  return [];
}

function ensureLocalStorage(pageSlug: string = 'home'): CmsSectionItem[] {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
    const filePath = getLocalFile(pageSlug);
    const defaults = getDefaultSectionsForPage(pageSlug);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaults, null, 2), 'utf8');
      return defaults;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map((p: any) => p.sectionId));
      const missing = defaults.filter((d) => !existingIds.has(d.sectionId));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        saveLocalStorage(pageSlug, merged);
        return merged;
      }
      return parsed;
    }
    return defaults;
  } catch (err) {
    console.warn(`Fallback storage warning for ${pageSlug}:`, err);
  }
  return getDefaultSectionsForPage(pageSlug);
}

function saveLocalStorage(pageSlug: string, sections: CmsSectionItem[]) {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
    const filePath = getLocalFile(pageSlug);
    fs.writeFileSync(filePath, JSON.stringify(sections, null, 2), 'utf8');
  } catch (err) {
    console.error(`Failed to write local CMS store for ${pageSlug}:`, err);
  }
}

/**
 * Get all sections for a page.
 * If mode === 'live', only returns visible sections with published data.
 * If mode === 'admin', returns all sections with draft/live indicator.
 */
function sanitizeHomeApplications(sections: CmsSectionItem[]): CmsSectionItem[] {
  const officialApps = [
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
  ];

  return sections.map((sec) => {
    if (sec.sectionId === 'home-applications') {
      const currentItems = Array.isArray(sec.items) && sec.items.length > 0 ? sec.items : officialApps;
      const sanitizedItems = currentItems.map((item: any, idx: number) => {
        const fallback = officialApps[idx % officialApps.length];
        const rawImg = item.image || item.url || '';
        const isBroken = !rawImg || rawImg.includes('/assets/images/app2.jpg') || rawImg.includes('/assets/images/app3.jpg') || rawImg.includes('/assets/images/app4.jpg');
        return {
          ...item,
          title: item.title && item.title !== 'New Architectural Application' ? item.title : fallback.title,
          category: item.category || fallback.category,
          image: isBroken ? fallback.image : rawImg,
          url: isBroken ? fallback.image : rawImg,
          link: item.link || fallback.link,
        };
      });

      return {
        ...sec,
        thumbnailUrl: sec.thumbnailUrl && !sec.thumbnailUrl.includes('app2.jpg') ? sec.thumbnailUrl : officialApps[0].image,
        items: sanitizedItems,
      };
    }
    return sec;
  });
}

export async function getCmsSections(
  pageSlug: string = 'home',
  mode: 'live' | 'admin' = 'live'
): Promise<CmsSectionItem[]> {
  try {
    await connectToDatabase();
    const query: any = { pageSlug };
    if (mode === 'live') {
      query.isVisible = true;
    }

    let docs = await Section.find(query).sort({ displayOrder: 1 }).lean();

    const defaults = getDefaultSectionsForPage(pageSlug);
    if (defaults && defaults.length > 0) {
      const existingIds = new Set((docs || []).map((d: any) => d.sectionId));
      const missingDefaults = defaults.filter((def) => !existingIds.has(def.sectionId));
      if (missingDefaults.length > 0) {
        for (const missing of missingDefaults) {
          try {
            await Section.findOneAndUpdate(
              { pageSlug: missing.pageSlug, sectionId: missing.sectionId },
              missing,
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
          } catch (seedErr) {
            console.warn(`Auto-seed notice for ${missing.sectionId}:`, seedErr);
          }
        }
        const refreshed = await Section.find(query).sort({ displayOrder: 1 }).lean();
        if (refreshed && refreshed.length > 0) {
          docs = refreshed;
        }
      }
    }

    if (docs && docs.length > 0) {
      // Map to plain objects
      const mapped = docs.map((doc: any) => {
        // If live mode, apply published content (if section was in draft, don't expose draft overrides)
        const sec: CmsSectionItem = {
          _id: doc._id?.toString(),
          pageSlug: doc.pageSlug,
          sectionId: doc.sectionId,
          sectionName: doc.sectionName,
          thumbnailUrl: doc.thumbnailUrl,
          eyebrow: doc.eyebrow,
          title: doc.title,
          subtitle: doc.subtitle,
          content: doc.content,
          mediaUrl: doc.mediaUrl,
          mediaType: doc.mediaType,
          mediaAlt: doc.mediaAlt,
          videoUrl: doc.videoUrl,
          ctaText: doc.ctaText,
          ctaUrl: doc.ctaUrl,
          items: doc.items,
          isVisible: doc.isVisible,
          displayOrder: doc.displayOrder,
          status: doc.status || 'published',
          draftContent: doc.draftContent,
          publishedAt: doc.publishedAt,
          lastDraftAt: doc.lastDraftAt,
          updatedAt: doc.updatedAt,
        };
        return sec;
      });

      const sanitizedMapped = sanitizeHomeApplications(mapped);
      // Keep local sync updated
      saveLocalStorage(pageSlug, sanitizedMapped);
      return sanitizedMapped;
    }
  } catch (err: any) {
    // Database connection timeout or offline: use fallback local store
    console.warn(`MongoDB query error (${err.message}). Using synchronized local CMS store.`);
  }

  // Fallback to local file store
  const localSections = sanitizeHomeApplications(ensureLocalStorage(pageSlug));
  if (mode === 'live') {
    return localSections.filter((s) => s.isVisible !== false).sort((a, b) => a.displayOrder - b.displayOrder);
  }
  return localSections.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Update or create a single section.
 */
export async function saveCmsSection(
  sectionData: Partial<CmsSectionItem> & { pageSlug: string; sectionId: string; sectionName: string },
  publishNow: boolean = false
): Promise<CmsSectionItem> {
  const now = new Date();
  const updatePayload: any = {
    ...sectionData,
    updatedAt: now,
  };

  if (publishNow) {
    updatePayload.status = 'published';
    updatePayload.publishedAt = now;
    // Clear draft overrides on publish
    updatePayload.draftContent = null;
  } else {
    updatePayload.status = 'draft';
    updatePayload.lastDraftAt = now;
    updatePayload.draftContent = { ...sectionData };
  }

  // Try MongoDB
  try {
    await connectToDatabase();
    const saved = await Section.findOneAndUpdate(
      { pageSlug: sectionData.pageSlug, sectionId: sectionData.sectionId },
      updatePayload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    if (saved) {
      const resSec: CmsSectionItem = {
        _id: (saved as any)._id?.toString(),
        pageSlug: saved.pageSlug,
        sectionId: saved.sectionId,
        sectionName: saved.sectionName,
        thumbnailUrl: saved.thumbnailUrl,
        eyebrow: saved.eyebrow,
        title: saved.title,
        subtitle: saved.subtitle,
        content: saved.content,
        mediaUrl: saved.mediaUrl,
        mediaType: saved.mediaType,
        mediaAlt: saved.mediaAlt,
        videoUrl: saved.videoUrl,
        ctaText: saved.ctaText,
        ctaUrl: saved.ctaUrl,
        items: saved.items,
        isVisible: saved.isVisible,
        displayOrder: saved.displayOrder,
        status: saved.status,
        draftContent: saved.draftContent,
        publishedAt: saved.publishedAt,
        lastDraftAt: saved.lastDraftAt,
      };

      // Also sync to local store
      const local = ensureLocalStorage(resSec.pageSlug);
      const idx = local.findIndex((s) => s.pageSlug === resSec.pageSlug && s.sectionId === resSec.sectionId);
      if (idx >= 0) {
        local[idx] = resSec;
      } else {
        local.push(resSec);
      }
      saveLocalStorage(resSec.pageSlug, local);

      // Two-way synchronization for application detail fields between home-applications and applications-cards
      if (resSec.sectionId === 'home-applications' && Array.isArray(resSec.items)) {
        syncHomeToApplicationsCatalog(resSec.items);
      } else if (resSec.sectionId === 'applications-cards' && Array.isArray(resSec.items)) {
        syncCatalogToHomeApplications(resSec.items);
      }

      return resSec;
    }
  } catch (err: any) {
    console.warn(`MongoDB save warning (${err.message}). Saving to resilient local store.`);
  }

  // Local file update
  const local = ensureLocalStorage(sectionData.pageSlug);
  const idx = local.findIndex((s) => s.pageSlug === sectionData.pageSlug && s.sectionId === sectionData.sectionId);
  const defaultList = getDefaultSectionsForPage(sectionData.pageSlug);
  const result: CmsSectionItem = {
    ...(idx >= 0 ? local[idx] : defaultList.find((s) => s.sectionId === sectionData.sectionId) || {}),
    ...updatePayload,
    pageSlug: sectionData.pageSlug,
    sectionId: sectionData.sectionId,
    sectionName: sectionData.sectionName,
    isVisible: sectionData.isVisible !== undefined ? sectionData.isVisible : true,
    displayOrder: sectionData.displayOrder !== undefined ? sectionData.displayOrder : idx >= 0 ? local[idx].displayOrder : 99,
  };

  if (idx >= 0) {
    local[idx] = result;
  } else {
    local.push(result);
  }
  saveLocalStorage(sectionData.pageSlug, local);

  // Two-way synchronization for application detail fields between home-applications and applications-cards
  if (sectionData.sectionId === 'home-applications' && Array.isArray(sectionData.items)) {
    syncHomeToApplicationsCatalog(sectionData.items);
  } else if (sectionData.sectionId === 'applications-cards' && Array.isArray(sectionData.items)) {
    syncCatalogToHomeApplications(sectionData.items);
  }

  return result;
}

function syncApplicationDetailFields(targetItem: any, sourceItem: any) {
  return {
    ...targetItem,
    title: sourceItem.title || targetItem.title,
    category: sourceItem.category || targetItem.category,
    image: sourceItem.image || targetItem.image,
    url: sourceItem.url || sourceItem.image || targetItem.url,
    detailHeroImage: sourceItem.detailHeroImage || sourceItem.image || targetItem.detailHeroImage,
    heroEyebrow: sourceItem.heroEyebrow !== undefined ? sourceItem.heroEyebrow : targetItem.heroEyebrow,
    heroTitle: sourceItem.heroTitle !== undefined ? sourceItem.heroTitle : targetItem.heroTitle,
    heroDesc: sourceItem.heroDesc !== undefined ? sourceItem.heroDesc : targetItem.heroDesc,
    originEyebrow: sourceItem.originEyebrow !== undefined ? sourceItem.originEyebrow : targetItem.originEyebrow,
    originHeadline: sourceItem.originHeadline !== undefined ? sourceItem.originHeadline : targetItem.originHeadline,
    storyParagraphs: sourceItem.storyParagraphs !== undefined ? sourceItem.storyParagraphs : targetItem.storyParagraphs,
  };
}

function syncHomeToApplicationsCatalog(homeItems: any[]) {
  try {
    const appSections = ensureLocalStorage('applications');
    const cardsSec = appSections.find((s) => s.sectionId === 'applications-cards');
    if (!cardsSec || !Array.isArray(cardsSec.items)) return;

    let modified = false;
    const updatedCards = cardsSec.items.map((card: any) => {
      const match = homeItems.find((h: any) =>
        h.id === card.id ||
        (h.id === 'modular-homes' && card.id === 'modular-homes') ||
        (h.id === 'hospitality-resorts' && card.id === 'hospitality') ||
        (h.id === 'farm-living-estates' && card.id === 'farm-living') ||
        (h.id === 'eco-developments' && card.id === 'eco-retreats')
      );
      if (match) {
        modified = true;
        return syncApplicationDetailFields(card, match);
      }
      return card;
    });

    if (modified) {
      cardsSec.items = updatedCards;
      saveLocalStorage('applications', appSections);
    }
  } catch (err) {
    console.warn('Sync home to applications catalog notice:', err);
  }
}

function syncCatalogToHomeApplications(catalogItems: any[]) {
  try {
    const homeSections = ensureLocalStorage('home');
    const bentoSec = homeSections.find((s) => s.sectionId === 'home-applications');
    if (!bentoSec || !Array.isArray(bentoSec.items)) return;

    let modified = false;
    const updatedBento = bentoSec.items.map((bento: any) => {
      const match = catalogItems.find((c: any) =>
        c.id === bento.id ||
        (bento.id === 'modular-homes' && c.id === 'modular-homes') ||
        (bento.id === 'hospitality-resorts' && c.id === 'hospitality') ||
        (bento.id === 'farm-living-estates' && c.id === 'farm-living') ||
        (bento.id === 'eco-developments' && c.id === 'eco-retreats')
      );
      if (match) {
        modified = true;
        return syncApplicationDetailFields(bento, match);
      }
      return bento;
    });

    if (modified) {
      bentoSec.items = updatedBento;
      saveLocalStorage('home', homeSections);
    }
  } catch (err) {
    console.warn('Sync catalog to home applications notice:', err);
  }
}

/**
 * Reorder sections
 */
export async function reorderCmsSections(
  pageSlug: string,
  orders: Array<{ sectionId: string; displayOrder: number }>
): Promise<boolean> {
  try {
    await connectToDatabase();
    await Promise.all(
      orders.map((o) => Section.findOneAndUpdate({ pageSlug, sectionId: o.sectionId }, { displayOrder: o.displayOrder }))
    );
  } catch (err: any) {
    console.warn('MongoDB reorder fallback:', err.message);
  }

  const local = ensureLocalStorage(pageSlug);
  orders.forEach((o) => {
    const sec = local.find((s) => s.pageSlug === pageSlug && s.sectionId === o.sectionId);
    if (sec) sec.displayOrder = o.displayOrder;
  });
  saveLocalStorage(pageSlug, local);
  return true;
}

/**
 * Publish all draft changes for a page to live
 */
export async function publishAllCmsSections(pageSlug: string): Promise<boolean> {
  const now = new Date();
  try {
    await connectToDatabase();
    await Section.updateMany(
      { pageSlug },
      {
        $set: {
          status: 'published',
          publishedAt: now,
          draftContent: null,
        },
      }
    );
  } catch (err: any) {
    console.warn('MongoDB publish all fallback:', err.message);
  }

  const local = ensureLocalStorage(pageSlug);
  local.forEach((sec) => {
    if (sec.pageSlug === pageSlug) {
      sec.status = 'published';
      sec.publishedAt = now.toISOString();
      sec.draftContent = undefined;
    }
  });
  saveLocalStorage(pageSlug, local);
  return true;
}
