import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Enquiry } from '../../../../models/Enquiry';
import { ActivityLog } from '../../../../models/ActivityLog';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let enquiries: any[] = [];
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 1500)
      );
      await Promise.race([connectToDatabase(), timeoutPromise]);

      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { product: { $regex: search, $options: 'i' } },
        ];
      }

      enquiries = await Enquiry.find(query).sort({ createdAt: -1 }).lean();
    } catch (dbErr: any) {
      console.warn('MongoDB enquiries query fallback:', dbErr.message);
    }

    if (!enquiries || enquiries.length === 0) {
      const fs = require('fs');
      const path = require('path');
      const storeFile = path.join(process.cwd(), 'src', 'data', 'enquiries_store.json');
      if (fs.existsSync(storeFile)) {
        try {
          const raw = fs.readFileSync(storeFile, 'utf8');
          enquiries = JSON.parse(raw);
          if (search) {
            const s = search.toLowerCase();
            enquiries = enquiries.filter(
              (e: any) =>
                e.name?.toLowerCase().includes(s) ||
                e.email?.toLowerCase().includes(s) ||
                e.phone?.toLowerCase().includes(s)
            );
          }
          if (status && status !== 'all') {
            enquiries = enquiries.filter((e: any) => e.status === status);
          }
        } catch {}
      }
    }

    return NextResponse.json({ enquiries: enquiries || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id, status, notes } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Enquiry id is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    let enquiry: any = null;

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 1800)
      );
      await Promise.race([connectToDatabase(), timeoutPromise]);
      enquiry = await Enquiry.findByIdAndUpdate(id, updateData, { new: true }).lean();

      if (enquiry) {
        try {
          await ActivityLog.create({
            userEmail: auth.session.email,
            userName: auth.session.name,
            action: 'update',
            entityType: 'enquiry',
            entityId: id,
            entityName: enquiry.name,
            details: `Updated enquiry status to "${status}" for ${enquiry.name}`,
          });
        } catch {}
      }
    } catch (dbErr: any) {
      console.warn('MongoDB enquiries PUT warning (updating local fallback store):', dbErr.message);
    }

    // Update local store fallback as well
    const fs = require('fs');
    const path = require('path');
    const storeFile = path.join(process.cwd(), 'src', 'data', 'enquiries_store.json');
    if (fs.existsSync(storeFile)) {
      try {
        const raw = fs.readFileSync(storeFile, 'utf8');
        let list = JSON.parse(raw);
        const idx = list.findIndex((e: any) => e._id === id || e.id === id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...updateData };
          if (!enquiry) enquiry = list[idx];
          fs.writeFileSync(storeFile, JSON.stringify(list, null, 2), 'utf8');
        }
      } catch {}
    }

    if (!enquiry) {
      enquiry = { _id: id, ...updateData };
    }

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Enquiry id is required' }, { status: 400 });
    }

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 1800)
      );
      await Promise.race([connectToDatabase(), timeoutPromise]);
      await Enquiry.findByIdAndDelete(id);
    } catch (dbErr: any) {
      console.warn('MongoDB enquiries DELETE warning:', dbErr.message);
    }

    // Also remove from local fallback store
    const fs = require('fs');
    const path = require('path');
    const storeFile = path.join(process.cwd(), 'src', 'data', 'enquiries_store.json');
    if (fs.existsSync(storeFile)) {
      try {
        const raw = fs.readFileSync(storeFile, 'utf8');
        let list = JSON.parse(raw);
        list = list.filter((e: any) => e._id !== id && e.id !== id);
        fs.writeFileSync(storeFile, JSON.stringify(list, null, 2), 'utf8');
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Enquiry deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
