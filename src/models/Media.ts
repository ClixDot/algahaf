import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedia extends Document {
  publicId: string;
  url: string;
  secureUrl: string;
  format?: string;
  resourceType: 'image' | 'video' | 'raw';
  bytes?: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  folder?: string;
  tags?: string[];
  usedIn?: Array<{
    pageSlug: string;
    sectionId: string;
    field: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: { type: String },
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    bytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    altText: { type: String, default: '' },
    caption: { type: String, default: '' },
    folder: { type: String, default: 'alghaf_website' },
    tags: [String],
    usedIn: [
      {
        pageSlug: String,
        sectionId: String,
        field: String,
      },
    ],
  },
  { timestamps: true }
);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;
