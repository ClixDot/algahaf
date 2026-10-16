import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPage extends Document {
  slug: string; // 'home', 'about', 'products', 'process', 'applications', 'contact', 'privacy', 'terms'
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  status: 'published' | 'draft';
  lastPublishedAt?: Date;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    lastPublishedAt: { type: Date },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

export default Page;
