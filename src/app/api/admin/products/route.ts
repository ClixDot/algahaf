import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Product } from '../../../../models/Product';
import { ActivityLog } from '../../../../models/ActivityLog';
import { normalizeProductData, getDefaultSeedProducts } from '../../../../lib/productsHelper';

export async function GET(req: NextRequest) {
  try {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 6000)
      );
      await Promise.race([connectToDatabase(), timeoutPromise]);

      let dbProducts = await Product.find().sort({ displayOrder: 1, createdAt: 1 }).lean();

      // If DB is empty or has fewer than 3 default products, seed default products into MongoDB
      if (!dbProducts || dbProducts.length === 0) {
        const seedItems = getDefaultSeedProducts();
        try {
          for (const item of seedItems) {
            await Product.findOneAndUpdate(
              { id: item.id },
              { ...item },
              { upsert: true, new: true }
            );
          }
          dbProducts = await Product.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
        } catch (seedErr: any) {
          console.warn('Auto-seed warning:', seedErr.message);
        }
      }

      if (dbProducts && dbProducts.length > 0) {
        const normalized = dbProducts.map((p) => normalizeProductData(p));
        return NextResponse.json({ products: normalized });
      }
    } catch (error: any) {
      console.warn('Products API DB warning (using default seed):', error.message);
    }

    return NextResponse.json({ products: getDefaultSeedProducts() });
  } catch (error: any) {
    return NextResponse.json({ products: getDefaultSeedProducts() });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const data = await req.json();

    if (!data.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const cleanId = (data.id || data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).toLowerCase().trim();
    const cleanSlug = (data.slug || cleanId).toLowerCase().trim();

    await connectToDatabase();

    // Check if ID already exists if creating new
    if (data.isNew) {
      const existing = await Product.findOne({ id: cleanId }).lean();
      if (existing) {
        return NextResponse.json({ error: `A product with ID "${cleanId}" already exists.` }, { status: 400 });
      }
    }

    const normalizedData = normalizeProductData({
      ...data,
      id: cleanId,
      slug: cleanSlug,
    });

    const product = await Product.findOneAndUpdate(
      { id: cleanId },
      { ...normalizedData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
      await ActivityLog.create({
        userEmail: auth.session.email,
        userName: auth.session.name,
        action: data.isNew ? 'create' : 'update',
        entityType: 'product',
        entityId: product.id,
        entityName: product.name,
        details: `${data.isNew ? 'Created new' : 'Updated'} product "${product.name}" (${product.id})`,
      });
    } catch (logErr: any) {
      console.warn('ActivityLog warning:', logErr.message);
    }

    return NextResponse.json({ success: true, product: normalizeProductData(product) });
  } catch (error: any) {
    console.error('Save product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save product' }, { status: 500 });
  }
}
