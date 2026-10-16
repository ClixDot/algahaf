import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import { GlobalSettings } from '../models/GlobalSettings';

const SETTINGS_STORE_FILE = path.join(process.cwd(), 'src', 'data', 'global_settings_store.json');

export const DEFAULT_SETTINGS = {
  siteName: 'AlGhaf Collective',
  tagline: 'Design Smarter. Build Precisely.',
  companyName: 'AlGhaf Collective',
  legalName: 'AlGhaf Modular Living Concepts LLC',
  phone: '+971 4 000 0000',
  email: 'info@alghafcollective.ae',
  address: 'Building 7, Dubai Design District (d3)',
  city: 'Dubai',
  country: 'United Arab Emirates',
  whatsapp: '+971500000000',
  instagram: 'https://www.instagram.com/alghafcollective',
  linkedin: 'https://www.linkedin.com/company/alghafcollective',
  facebook: 'https://www.facebook.com/alghafcollective',
  headerLogo: '/assets/logos/AlGhaf_logo_-10.png',
  footerLogo: '/assets/logos/AlGhaf_logo_-08.png',
  favicon: '/assets/logos/AlGhaf_logo_-10.png',
  headerCtaText: 'ENQUIRY',
  headerCtaUrl: '#enquiry',
  footerDescription:
    'Transforming housing from a fragmented project into a designed, engineered, and continuously refined product.',
  footerTagline: 'Rooted in Nature. Built for Tomorrow.',
  copyrightText: 'AlGhaf Collective. All rights reserved. | Powered by Clixdot',
  // Toggle for Applications & Typologies navlink visibility on website
  showApplicationsNav: false,
  applicationsComingSoon: false,
  // Toggle for Individual Product Details Pages (/products/mova, etc.) access
  productDetailsAccess: false,
  headerNav: [
    { label: 'Home', path: '/', isComingSoon: false, order: 0 },
    { label: 'About', path: '/about', isComingSoon: false, order: 1 },
    { label: 'Products', path: '/products', isComingSoon: false, order: 2 },
    { label: 'Applications', path: '/applications', isComingSoon: false, order: 3 },
    { label: 'Contact', path: '/contact', isComingSoon: false, order: 4 },
  ],
};

function ensureLocalSettings(): any {
  try {
    const dir = path.dirname(SETTINGS_STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(SETTINGS_STORE_FILE)) {
      fs.writeFileSync(SETTINGS_STORE_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
      return DEFAULT_SETTINGS;
    }
    const raw = fs.readFileSync(SETTINGS_STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.warn('Local settings fallback read error:', err);
    return DEFAULT_SETTINGS;
  }
}

function saveLocalSettings(data: any) {
  try {
    const dir = path.dirname(SETTINGS_STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Local settings fallback write error:', err);
  }
}

export async function getGlobalSettings(): Promise<any> {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 8000)
    );
    await Promise.race([connectToDatabase(), timeoutPromise]);
    const doc = await GlobalSettings.findOne().lean();
    if (doc) {
      const local = ensureLocalSettings();
      const merged = { ...DEFAULT_SETTINGS, ...local, ...(doc as any) };
      if (typeof (doc as any).productDetailsAccess === 'boolean') {
        merged.productDetailsAccess = (doc as any).productDetailsAccess;
      } else if (typeof local.productDetailsAccess === 'boolean') {
        merged.productDetailsAccess = local.productDetailsAccess;
      }
      saveLocalSettings(merged);
      return merged;
    }
  } catch (dbErr: any) {
    console.warn('MongoDB read fallback for global settings:', dbErr.message);
  }
  return ensureLocalSettings();
}

export async function updateGlobalSettings(data: any): Promise<any> {
  const current = ensureLocalSettings();
  const merged = { ...current, ...data };
  
  // Clean up _id and __v before updating in MongoDB
  const { _id, __v, ...cleanPayload } = merged;

  // Save locally first so update is immediate
  saveLocalSettings(merged);

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 8000)
    );
    await Promise.race([connectToDatabase(), timeoutPromise]);
    const updated = await GlobalSettings.findOneAndUpdate(
      {},
      { $set: cleanPayload },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).lean();
    if (updated) {
      const res = { ...DEFAULT_SETTINGS, ...merged, ...(updated as any) };
      if (typeof data.productDetailsAccess === 'boolean') {
        res.productDetailsAccess = data.productDetailsAccess;
      }
      saveLocalSettings(res);
      return res;
    }
  } catch (dbErr: any) {
    console.warn('MongoDB save warning for global settings:', dbErr.message);
  }

  return merged;
}
