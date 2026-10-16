import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGlobalSettings extends Document {
  siteName: string;
  tagline: string;
  companyName: string;
  legalName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  headerLogo: string;
  footerLogo: string;
  favicon: string;
  headerNav: Array<{
    label: string;
    path: string;
    isComingSoon?: boolean;
    order: number;
  }>;
  headerCtaText: string;
  headerCtaUrl: string;
  footerDescription: string;
  footerTagline: string;
  footerLinks: Array<{
    category: string;
    label: string;
    url: string;
  }>;
  copyrightText: string;
  applicationsComingSoon?: boolean;
  showApplicationsNav?: boolean;
  productDetailsAccess?: boolean;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultKeywords: string;
  defaultOgImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>(
  {
    siteName: { type: String, default: 'AlGhaf Collective' },
    tagline: { type: String, default: 'Design Smarter. Build Precisely.' },
    companyName: { type: String, default: 'AlGhaf Collective' },
    legalName: { type: String, default: 'AlGhaf Modular Living Concepts LLC' },
    phone: { type: String, default: '+971 4 000 0000' },
    email: { type: String, default: 'info@alghafcollective.ae' },
    address: { type: String, default: 'Building 7, Dubai Design District (d3)' },
    city: { type: String, default: 'Dubai' },
    country: { type: String, default: 'United Arab Emirates' },
    whatsapp: { type: String, default: '+971500000000' },
    instagram: { type: String, default: 'https://www.instagram.com/alghafcollective' },
    linkedin: { type: String, default: 'https://www.linkedin.com/company/alghafcollective' },
    facebook: { type: String, default: 'https://www.facebook.com/alghafcollective' },
    headerLogo: { type: String, default: '/assets/logos/AlGhaf_logo_-10.png' },
    footerLogo: { type: String, default: '/assets/logos/AlGhaf_logo_-08.png' },
    favicon: { type: String, default: '/assets/logos/AlGhaf_logo_-10.png' },
    headerNav: [
      {
        label: String,
        path: String,
        isComingSoon: Boolean,
        order: Number,
      },
    ],
    headerCtaText: { type: String, default: 'ENQUIRY' },
    headerCtaUrl: { type: String, default: '#enquiry' },
    footerDescription: {
      type: String,
      default:
        'Transforming housing from a fragmented project into a designed, engineered, and continuously refined product.',
    },
    footerTagline: { type: String, default: 'Rooted in Nature. Built for Tomorrow.' },
    footerLinks: [
      {
        category: String,
        label: String,
        url: String,
      },
    ],
    copyrightText: { type: String, default: 'AlGhaf Collective. All rights reserved. | Powered by Clixdot' },
    applicationsComingSoon: { type: Boolean, default: false },
    showApplicationsNav: { type: Boolean, default: false },
    productDetailsAccess: { type: Boolean, default: false },
    defaultSeoTitle: { type: String, default: 'AlGhaf Collective — Design Smarter. Build Precisely.' },
    defaultSeoDescription: {
      type: String,
      default:
        'UAE-based integrated design, prefabrication, and modular construction company creating smarter, more sustainable homes through one integrated system.',
    },
    defaultKeywords: {
      type: String,
      default:
        'AlGhaf Collective, modular homes UAE, prefabrication Dubai, luxury modular architecture, MOVA, PENTA, ENTRA',
    },
    defaultOgImage: { type: String, default: '/assets/images/ax.jpg' },
  },
  { timestamps: true }
);

export const GlobalSettings: Model<IGlobalSettings> =
  mongoose.models.GlobalSettings || mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);

export default GlobalSettings;
