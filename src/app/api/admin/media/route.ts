import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Media } from '../../../../models/Media';
import { ActivityLog } from '../../../../models/ActivityLog';
import { uploadToCloudinary, deleteFromCloudinary } from '../../../../lib/cloudinary';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 6000)
      );
      await Promise.race([connectToDatabase(), timeoutPromise]);

      const query: any = {};
      if (type && type !== 'all') {
        query.resourceType = type;
      }
      if (search) {
        query.$or = [
          { publicId: { $regex: search, $options: 'i' } },
          { altText: { $regex: search, $options: 'i' } },
          { caption: { $regex: search, $options: 'i' } },
        ];
      }

      const mediaList = await Media.find(query).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ media: mediaList || [] });
    } catch (dbErr: any) {
      console.warn('Media list DB warning (returning empty list):', dbErr.message);
      return NextResponse.json({ media: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ media: [] });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';
    const caption = (formData.get('caption') as string) || '';
    const folder = (formData.get('folder') as string) || 'alghaf_website';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const uploaded = await uploadToCloudinary(buffer, folder, resourceType);

    let mediaRecord: any = {
      publicId: uploaded.public_id,
      url: uploaded.url,
      secureUrl: uploaded.secure_url,
      format: uploaded.format,
      resourceType,
      bytes: uploaded.bytes,
      altText: altText || file.name,
      caption,
      folder,
    };

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 6000)
      );
      await Promise.race([connectToDatabase(), timeoutPromise]);
      const media = await Media.create(mediaRecord);
      if (media) mediaRecord = media;

      await ActivityLog.create({
        userEmail: auth.session.email,
        userName: auth.session.name,
        action: 'create',
        entityType: 'media',
        entityId: mediaRecord._id?.toString() || uploaded.public_id,
        entityName: file.name,
        details: `Uploaded ${resourceType} "${file.name}" to Cloudinary (${uploaded.public_id})`,
      });
    } catch (dbErr: any) {
      console.warn('MongoDB media record write warning (returning Cloudinary upload directly):', dbErr.message);
    }

    return NextResponse.json({ success: true, media: mediaRecord });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: error.message || 'Media upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const media = await Media.findById(id);

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check if asset is referenced elsewhere before deleting
    if (media.usedIn && media.usedIn.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete asset. It is currently referenced in: ${media.usedIn
            .map((u) => `${u.pageSlug}/${u.sectionId}`)
            .join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(media.publicId, media.resourceType as 'image' | 'video');
    } catch (cErr) {
      console.warn('Cloudinary delete warning (continuing DB delete):', cErr);
    }

    await Media.findByIdAndDelete(id);

    await ActivityLog.create({
      userEmail: auth.session.email,
      userName: auth.session.name,
      action: 'delete',
      entityType: 'media',
      entityId: id,
      entityName: media.publicId,
      details: `Deleted media asset (${media.publicId})`,
    });

    return NextResponse.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
