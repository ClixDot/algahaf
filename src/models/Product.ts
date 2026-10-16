import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductSpecificationItem {
  label: string;
  value: string;
  unit?: string;
  category?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface IProductTechnicalProfileItem {
  label: string;
  val: string;
  unit?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface IProductFloorplan {
  name: string;
  size?: string;
  area?: string;
  dimensions?: string;
  description: string;
  image?: string;
  pdfUrl?: string;
  bedrooms?: string;
  bathrooms?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface IProductFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface IProduct extends Document {
  id: string; // e.g. "mova", "penta", "entra"
  slug: string;
  name: string;
  fullName: string;
  sizeRange: string;
  sizeRangeImperial?: string;
  tagline: string;
  shortDescription: string;
  fullDescription?: string;
  keyQuote?: string;
  category: string;
  leadTime: string;

  // Hero Section
  heroEyebrow?: string;
  heroHeading?: string;
  heroSubtitle?: string;
  heroTagline?: string;
  heroImage: string;
  heroImageAlt?: string;
  heroImagePosition?: string;
  heroOverlayColor?: string;
  heroOverlayOpacity?: number;
  heroCtaText?: string;
  heroCtaDestination?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaDestination?: string;
  heroVideoUrl?: string;
  heroCtaVisible?: boolean;

  // Overview Section
  overviewEyebrow?: string;
  overviewHeading?: string;
  overviewParagraphs?: string[];
  overviewImage?: string;
  overviewVisible?: boolean;
  applications: string[];

  // Key Technical Profile Card
  technicalProfileTitle?: string;
  technicalProfile: IProductTechnicalProfileItem[];
  technicalProfileButtonText?: string;
  technicalProfileButtonDestination?: string;
  technicalProfileVisible?: boolean;

  // Visual Showcase / Galleries
  previewImage: string;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallery: {
    exterior: string[];
    interior: string[];
    plans?: string[];
  };
  galleryVisible?: boolean;

  // Precision Engineering / Floor Plans & Specs
  plansEyebrow?: string;
  plansTitle?: string;
  plansSubtitle?: string;
  floorplansTitle?: string;
  floorplans: IProductFloorplan[];
  specificationsTitle?: string;
  specifications: IProductSpecificationItem[] | any;
  specsVisible?: boolean;

  // Related Collections
  relatedEyebrow?: string;
  relatedTitle?: string;
  relatedProducts?: string[]; // IDs of related products e.g. ['penta', 'entra']
  relatedVisible?: boolean;

  // Product Enquiry & CTA
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaDestination?: string;
  whatsappUrl?: string;
  ctaVisible?: boolean;

  // SEO & Metadata
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };

  // Legacy dimensions & features support
  dimensions?: {
    width?: string;
    length?: string;
    height?: string;
    ceilingHeight?: string;
    area?: string;
  };
  features?: IProductFeature[];

  status: 'published' | 'draft';
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    fullName: { type: String, required: true },
    sizeRange: { type: String, required: true },
    sizeRangeImperial: { type: String },
    tagline: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    keyQuote: { type: String },
    category: { type: String, required: true },
    leadTime: { type: String, required: true },

    heroEyebrow: { type: String },
    heroHeading: { type: String },
    heroSubtitle: { type: String },
    heroTagline: { type: String },
    heroImage: { type: String, required: true },
    heroImageAlt: { type: String },
    heroImagePosition: { type: String, default: 'center' },
    heroOverlayColor: { type: String, default: '#000000' },
    heroOverlayOpacity: { type: Number, default: 0.6 },
    heroCtaText: { type: String },
    heroCtaDestination: { type: String },
    heroSecondaryCtaText: { type: String },
    heroSecondaryCtaDestination: { type: String },
    heroVideoUrl: { type: String },
    heroCtaVisible: { type: Boolean, default: true },

    overviewEyebrow: { type: String, default: 'Architectural Overview' },
    overviewHeading: { type: String },
    overviewParagraphs: [{ type: String }],
    overviewImage: { type: String },
    overviewVisible: { type: Boolean, default: true },
    applications: [{ type: String }],

    technicalProfileTitle: { type: String, default: 'Key Technical Profile' },
    technicalProfile: [
      {
        label: { type: String },
        val: { type: String },
        unit: { type: String },
        displayOrder: { type: Number, default: 0 },
        isVisible: { type: Boolean, default: true },
      },
    ],
    technicalProfileButtonText: { type: String, default: 'Request Technical Floor Plans' },
    technicalProfileButtonDestination: { type: String, default: '#enquiry' },
    technicalProfileVisible: { type: Boolean, default: true },

    previewImage: { type: String, required: true },
    galleryEyebrow: { type: String, default: 'Visual Showcase' },
    galleryTitle: { type: String },
    gallery: {
      exterior: [{ type: String }],
      interior: [{ type: String }],
      plans: [{ type: String }],
    },
    galleryVisible: { type: Boolean, default: true },

    plansEyebrow: { type: String, default: 'Precision Engineering' },
    plansTitle: { type: String, default: 'Specifications & Floor Configurations.' },
    plansSubtitle: { type: String, default: 'Verified architectural tolerances and standard layout options.' },
    floorplansTitle: { type: String, default: 'Curated Layout Plans' },
    floorplans: [
      {
        name: { type: String },
        size: { type: String },
        area: { type: String },
        dimensions: { type: String },
        description: { type: String },
        image: { type: String },
        pdfUrl: { type: String },
        bedrooms: { type: String },
        bathrooms: { type: String },
        displayOrder: { type: Number, default: 0 },
        isVisible: { type: Boolean, default: true },
      },
    ],
    specificationsTitle: { type: String, default: 'Technical Specifications' },
    specifications: { type: Schema.Types.Mixed, default: [] },
    specsVisible: { type: Boolean, default: true },

    relatedEyebrow: { type: String, default: 'Explore Other Systems' },
    relatedTitle: { type: String, default: 'Related AlGhaf Collections.' },
    relatedProducts: [{ type: String }],
    relatedVisible: { type: Boolean, default: true },

    ctaEyebrow: { type: String },
    ctaHeading: { type: String },
    ctaDescription: { type: String },
    ctaButtonText: { type: String, default: 'Enquire About This Collection' },
    ctaDestination: { type: String, default: '#enquiry' },
    whatsappUrl: { type: String },
    ctaVisible: { type: Boolean, default: true },

    seo: {
      title: { type: String },
      description: { type: String },
      keywords: { type: String },
      ogImage: { type: String },
      canonicalUrl: { type: String },
    },

    dimensions: {
      width: String,
      length: String,
      height: String,
      ceilingHeight: String,
      area: String,
    },
    features: [
      {
        title: { type: String },
        description: { type: String },
        icon: { type: String },
      },
    ],
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
