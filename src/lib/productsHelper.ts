import { products as defaultProducts } from '../data/productsData';

export function normalizeProductData(rawProduct: any) {
  if (!rawProduct) return null;

  const id = (rawProduct.id || rawProduct.slug || '').toLowerCase();
  const def = defaultProducts.find((p) => p.id.toLowerCase() === id || p.slug.toLowerCase() === id);

  // Normalize technical profile
  let technicalProfile = rawProduct.technicalProfile;
  if (!technicalProfile || !Array.isArray(technicalProfile) || technicalProfile.length === 0) {
    if (id === 'mova') {
      technicalProfile = [
        { label: 'Available Sizes', val: '30 m² to 75 m² (323–807 sq ft)' },
        { label: 'Production Turnaround', val: '6 to 10 Weeks (Factory Built)' },
        { label: 'On-Site Installation', val: '1 to 2 Days (Crane Lift Assembly)' },
        { label: 'Climate Suitability', val: 'Engineered for extreme GCC desert climates' },
        { label: 'Structural Guarantee', val: '10-Year High-Tensile Steel Warranty' },
      ];
    } else if (id === 'penta') {
      technicalProfile = [
        { label: 'Available Sizes', val: '50 m² to 300 m² (538–3,229 sq ft)' },
        { label: 'Production Turnaround', val: '8 to 14 Weeks (Off-Site Built)' },
        { label: 'On-Site Installation', val: '2 to 4 Days (Crane Lift Assembly)' },
        { label: 'Climate Suitability', val: 'Triple-glazed thermal envelope for GCC climates' },
        { label: 'Structural Guarantee', val: '10-Year High-Tensile Structural Warranty' },
      ];
    } else if (id === 'entra') {
      technicalProfile = [
        { label: 'Available Sizes', val: '30 m² · 45 m² · 60 m² (3 Scalable Sizes)' },
        { label: 'Production Turnaround', val: '6 to 8 Weeks (Factory Assembly)' },
        { label: 'On-Site Installation', val: '1 to 2 Days (Plug & Play Deployment)' },
        { label: 'Acoustic Rating', val: 'STC 60+ Reference Acoustic Soundproofing' },
        { label: 'Structural Guarantee', val: '10-Year Structural & Acoustic Warranty' },
      ];
    } else {
      technicalProfile = [
        { label: 'Available Sizes', val: rawProduct.sizeRange || 'Modular Scalable' },
        { label: 'Production Turnaround', val: rawProduct.leadTime || '6 to 10 Weeks' },
        { label: 'On-Site Installation', val: '1 to 3 Days' },
        { label: 'Climate Suitability', val: 'Engineered for GCC desert climates' },
        { label: 'Structural Guarantee', val: '10-Year Structural Warranty' },
      ];
    }
  }

  // Normalize overview paragraphs
  let overviewParagraphs = rawProduct.overviewParagraphs;
  if (!overviewParagraphs || !Array.isArray(overviewParagraphs) || overviewParagraphs.length === 0) {
    if (rawProduct.fullDescription) {
      overviewParagraphs = [rawProduct.fullDescription];
    } else if (def?.fullDescription) {
      overviewParagraphs = [def.fullDescription];
    } else {
      overviewParagraphs = [rawProduct.shortDescription || ''];
    }
  }

  // Normalize related products
  let relatedProducts = rawProduct.relatedProducts;
  if (!relatedProducts || !Array.isArray(relatedProducts) || relatedProducts.length === 0) {
    relatedProducts = defaultProducts
      .filter((p) => p.id.toLowerCase() !== id)
      .map((p) => p.id.toLowerCase());
  }

  // Normalize gallery
  const gallery = {
    exterior: Array.isArray(rawProduct.gallery?.exterior) ? rawProduct.gallery.exterior : def?.gallery?.exterior || [],
    interior: Array.isArray(rawProduct.gallery?.interior) ? rawProduct.gallery.interior : def?.gallery?.interior || [],
    plans: Array.isArray(rawProduct.gallery?.plans) ? rawProduct.gallery.plans : ((def?.gallery as any)?.plans || []),
  };

  // Normalize floorplans
  let floorplans = rawProduct.floorplans;
  if (!floorplans || !Array.isArray(floorplans) || floorplans.length === 0) {
    floorplans = def?.floorplans || [];
  }

  // Normalize specifications
  let specifications = rawProduct.specifications;
  if (!specifications || (Array.isArray(specifications) && specifications.length === 0)) {
    specifications = def?.specifications || [];
  }

  return {
    ...rawProduct,
    id,
    slug: rawProduct.slug || id,
    name: rawProduct.name || def?.name || id.toUpperCase(),
    fullName: rawProduct.fullName || def?.fullName || '',
    category: rawProduct.category || def?.category || 'Modular Living',
    tagline: rawProduct.tagline || def?.tagline || '',
    sizeRange: rawProduct.sizeRange || def?.sizeRange || '30–75 m²',
    sizeRangeImperial: rawProduct.sizeRangeImperial || def?.sizeRangeImperial || '',
    leadTime: rawProduct.leadTime || def?.leadTime || '6–10 Weeks',
    shortDescription: rawProduct.shortDescription || def?.shortDescription || '',
    fullDescription: rawProduct.fullDescription || def?.fullDescription || '',
    keyQuote: rawProduct.keyQuote || def?.keyQuote || '',
    heroImage: rawProduct.heroImage || def?.heroImage || '/assets/renders/MOVA_EXT_3D_img1.jpg',
    previewImage: rawProduct.previewImage || def?.previewImage || rawProduct.heroImage || '/assets/renders/MOVA_EXT_3D_img2.jpg',
    heroEyebrow: rawProduct.heroEyebrow || 'MODULAR ARCHITECTURAL SYSTEM',
    heroHeading: rawProduct.heroHeading || rawProduct.name || def?.name || 'MOVA',
    heroSubtitle: rawProduct.heroSubtitle || rawProduct.fullName || def?.fullName || '',
    heroTagline: rawProduct.heroTagline || (rawProduct.tagline ? `"${rawProduct.tagline}"` : ''),
    heroCtaText: rawProduct.heroCtaText || `Enquire About ${rawProduct.name || id.toUpperCase()}`,
    heroCtaDestination: rawProduct.heroCtaDestination || '#enquiry',
    heroSecondaryCtaText: rawProduct.heroSecondaryCtaText || 'View 3D Renders',
    heroSecondaryCtaDestination: rawProduct.heroSecondaryCtaDestination || '#renders',
    heroCtaVisible: rawProduct.heroCtaVisible !== false,
    overviewEyebrow: rawProduct.overviewEyebrow || 'Architectural Overview',
    overviewHeading: rawProduct.overviewHeading || (id === 'mova' ? 'Versatile Living. Engineered Without Limits.' : id === 'penta' ? 'Elevated Double-Height Architecture.' : 'Private Entertainment. Acoustically Perfected.'),
    overviewParagraphs,
    overviewVisible: rawProduct.overviewVisible !== false,
    applications: Array.isArray(rawProduct.applications) && rawProduct.applications.length > 0 ? rawProduct.applications : def?.applications || [],
    technicalProfileTitle: rawProduct.technicalProfileTitle || 'Key Technical Profile',
    technicalProfile,
    technicalProfileButtonText: rawProduct.technicalProfileButtonText || 'Request Technical Floor Plans',
    technicalProfileButtonDestination: rawProduct.technicalProfileButtonDestination || '#enquiry',
    technicalProfileVisible: rawProduct.technicalProfileVisible !== false,
    galleryEyebrow: rawProduct.galleryEyebrow || 'Visual Showcase',
    galleryTitle: rawProduct.galleryTitle || `${rawProduct.name || id.toUpperCase()} Architectural Renders`,
    gallery,
    galleryVisible: rawProduct.galleryVisible !== false,
    plansEyebrow: rawProduct.plansEyebrow || 'Precision Engineering',
    plansTitle: rawProduct.plansTitle || 'Specifications & Floor Configurations.',
    plansSubtitle: rawProduct.plansSubtitle || 'Verified architectural tolerances and standard layout options.',
    floorplansTitle: rawProduct.floorplansTitle || 'Curated Layout Plans',
    floorplans,
    specificationsTitle: rawProduct.specificationsTitle || 'Technical Specifications',
    specifications,
    specsVisible: rawProduct.specsVisible !== false,
    relatedEyebrow: rawProduct.relatedEyebrow || 'Explore Other Systems',
    relatedTitle: rawProduct.relatedTitle || 'Related AlGhaf Collections.',
    relatedProducts,
    relatedVisible: rawProduct.relatedVisible !== false,
    ctaHeading: rawProduct.ctaHeading || `Ready to Build with ${rawProduct.name || id.toUpperCase()}?`,
    ctaDescription: rawProduct.ctaDescription || 'Connect with our architectural advisory team to discuss spatial configurations, turnkey delivery timelines, and customized site integration.',
    ctaButtonText: rawProduct.ctaButtonText || `Enquire About ${rawProduct.name || id.toUpperCase()}`,
    ctaDestination: rawProduct.ctaDestination || '#enquiry',
    ctaVisible: rawProduct.ctaVisible !== false,
    seo: rawProduct.seo || {
      title: `${rawProduct.name || id.toUpperCase()} — ${rawProduct.fullName || 'AlGhaf Modular Architecture'}`,
      description: rawProduct.shortDescription || 'Precision-engineered modular architectural systems by AlGhaf Collective.',
      keywords: `${rawProduct.name}, modular villa, prefab UAE, luxury architecture`,
      ogImage: rawProduct.heroImage,
    },
    status: rawProduct.status || 'published',
    displayOrder: rawProduct.displayOrder || (id === 'mova' ? 1 : id === 'penta' ? 2 : id === 'entra' ? 3 : 99),
  };
}

export function getDefaultSeedProducts() {
  return defaultProducts.map((p) => normalizeProductData(p));
}

export async function getLiveProduct(idOrSlug: string) {
  const cleanId = (idOrSlug || '').toLowerCase().trim();
  try {
    const { connectToDatabase } = await import('./mongodb');
    const { Product } = await import('../models/Product');
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 4000)
    );
    await Promise.race([connectToDatabase(), timeoutPromise]);

    const product = await Product.findOne({
      $or: [{ id: cleanId }, { slug: cleanId }],
      status: 'published',
    }).lean();

    if (product) {
      return normalizeProductData(product);
    }
  } catch (err: any) {
    console.warn('getLiveProduct DB fallback:', err.message);
  }

  const def = defaultProducts.find(
    (p) => p.id.toLowerCase() === cleanId || p.slug.toLowerCase() === cleanId
  );
  return def ? normalizeProductData(def) : null;
}

