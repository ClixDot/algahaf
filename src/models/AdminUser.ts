import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'admin' | 'editor';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
