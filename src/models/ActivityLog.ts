import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  userEmail: string;
  userName?: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'login' | 'logout';
  entityType: 'page' | 'section' | 'product' | 'media' | 'settings' | 'enquiry' | 'user';
  entityId?: string;
  entityName?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userEmail: { type: String, required: true },
    userName: { type: String },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'publish', 'login', 'logout'],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['page', 'section', 'product', 'media', 'settings', 'enquiry', 'user'],
      required: true,
    },
    entityId: { type: String },
    entityName: { type: String },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
