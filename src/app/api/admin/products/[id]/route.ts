import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../lib/auth';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { Product } from '../../../../../models/Product';
import { ActivityLog } from '../../../../../models/ActivityLog';
import { products as defaultProducts } from '../../../../../data/productsData';
import { normalizeProductData } from '../../../../../lib/productsHelper';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cleanId = id.toLowerCase().trim();

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 6000)
      );
      await Promise.race([connectToDatabase(), timeoutPromise]);

      const product = await Product.findOne({
        $or: [{ id: cleanId }, { slug: cleanId }],
      }).lean();

      if (product) {
        return NextResponse.json({ product: normalizeProductData(product) });
      }
    } catch (dbErr: any) {
      console.warn('Product detail DB warning (using static product):', dbErr.message);
    }

    const fallback = defaultProducts.find(
      (p) => p.id.toLowerCase() === cleanId || p.slug.toLowerCase() === cleanId
    );
    if (fallback) {
      return NextResponse.json({ product: normalizeProductData(fallback) });
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const cleanId = id.toLowerCase().trim();
    const body = await req.json();

    await connectToDatabase();

    const normalized = normalizeProductData({
      ...body,
      id: cleanId,
      slug: body.slug || cleanId,
    });

    const product = await Product.findOneAndUpdate(
      { $or: [{ id: cleanId }, { slug: cleanId }] },
      { ...normalized },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
      await ActivityLog.create({
        userEmail: auth.session.email,
        userName: auth.session.name,
        action: 'update',
        entityType: 'product',
        entityId: product.id,
        entityName: product.name,
        details: `Saved product "${product.name}" (${product.id}) with status ${product.status || 'published'}`,
      });
    } catch (logErr: any) {
      console.warn('ActivityLog write warning:', logErr.message);
    }

    return NextResponse.json({ success: true, product: normalizeProductData(product) });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const cleanId = id.toLowerCase().trim();
    await connectToDatabase();

    const product = await Product.findOneAndDelete({
      $or: [{ id: cleanId }, { slug: cleanId }],
    });

    if (product) {
      try {
        await ActivityLog.create({
          userEmail: auth.session.email,
          userName: auth.session.name,
          action: 'delete',
          entityType: 'product',
          entityId: id,
          entityName: product.name,
          details: `Deleted product "${product.name}"`,
        });
      } catch (logErr: any) {
        console.warn('ActivityLog delete warning:', logErr.message);
      }
    }

    return NextResponse.json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
