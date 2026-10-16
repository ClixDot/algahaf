import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISection extends Document {
  pageSlug: string; // 'home', 'about', 'products', 'process', 'applications', 'contact'
  sectionId: string; // e.g., 'home-hero', 'home-origin', 'home-philosophy', etc.
  sectionName: string; // Human readable title e.g. "Hero Cinematic Banner"
  thumbnailUrl?: string; // Section visual preview thumbnail
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
  items?: Array<{
    id?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    icon?: string;
    image?: string;
    tag?: string;
    link?: string;
    url?: string;
    label?: string;
    position?: string;
    number?: string;
    category?: string;
    [key: string]: any;
  }>;
  isVisible: boolean;
  displayOrder: number;
  status: 'published' | 'draft';
  draftContent?: Record<string, any>;
  publishedAt?: Date;
  lastDraftAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<ISection>(
  {
    pageSlug: { type: String, required: true, index: true },
    sectionId: { type: String, required: true, index: true },
    sectionName: { type: String, required: true },
    thumbnailUrl: { type: String },
    eyebrow: { type: String },
    title: { type: String },
    subtitle: { type: String },
    content: { type: String },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    mediaAlt: { type: String },
    videoUrl: { type: String },
    ctaText: { type: String },
    ctaUrl: { type: String },
    items: [Schema.Types.Mixed],
    isVisible: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    draftContent: { type: Schema.Types.Mixed },
    publishedAt: { type: Date },
    lastDraftAt: { type: Date },
  },
  { timestamps: true }
);

SectionSchema.index({ pageSlug: 1, sectionId: 1 }, { unique: true });

export const Section: Model<ISection> =
  mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);

export default Section;
