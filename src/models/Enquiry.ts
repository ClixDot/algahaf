import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  company?: string;
  email: string;
  phone: string;
  location?: string;
  product?: string;
  timeline?: string;
  approximateSize?: string;
  projectType?: string;
  message?: string;
  source: 'quick-modal' | 'contact-page' | 'product-page';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  notes?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, default: 'Dubai' },
    product: { type: String },
    timeline: { type: String },
    approximateSize: { type: String },
    projectType: { type: String },
    message: { type: String },
    source: { type: String, enum: ['quick-modal', 'contact-page', 'product-page'], default: 'quick-modal' },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'closed'], default: 'new' },
    notes: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
