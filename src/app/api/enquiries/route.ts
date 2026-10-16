import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { Enquiry } from '../../../models/Enquiry';

import fs from 'fs';
import path from 'path';

const ENQUIRIES_FILE = path.join(process.cwd(), 'src', 'data', 'enquiries_store.json');

function saveLocalEnquiry(enquiry: any) {
  try {
    const dir = path.dirname(ENQUIRIES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let list: any[] = [];
    if (fs.existsSync(ENQUIRIES_FILE)) {
      try {
        list = JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf8'));
      } catch {}
    }
    list.unshift(enquiry);
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Local enquiry fallback error:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, location, product, timeline, approximateSize, projectType, message, source } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = new Date();
    const enquiryDoc: any = {
      _id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      company: company ? company.trim() : '',
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      location: location || 'Dubai',
      product,
      timeline,
      approximateSize,
      projectType,
      message,
      source: source || 'contact-page',
      status: 'new',
      ipAddress: ip,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Always preserve locally
    saveLocalEnquiry(enquiryDoc);

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 1500)
      );
      await Promise.race([connectToDatabase(), timeoutPromise]);
      const saved = await Enquiry.create(enquiryDoc);
      if (saved) enquiryDoc._id = saved._id;
    } catch (dbErr: any) {
      console.warn('MongoDB enquiry save notice (persisted to local store):', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you. Your architectural consultation request has been submitted.',
      enquiryId: enquiryDoc._id,
    });
  } catch (error: any) {
    console.error('Public Enquiry API error:', error);
    return NextResponse.json(
      { error: error.message || 'Unable to submit enquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
