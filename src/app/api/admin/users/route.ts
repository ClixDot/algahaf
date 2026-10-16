import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hashPassword } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import { AdminUser } from '../../../../models/AdminUser';
import { ActivityLog } from '../../../../models/ActivityLog';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  const defaultUserList = [
    {
      _id: 'default-admin',
      name: 'AlGhaf Super Admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@alghaf.ae',
      role: 'superadmin',
      createdAt: new Date(),
    },
  ];

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 1800)
    );
    await Promise.race([connectToDatabase(), timeoutPromise]);
    const users = await AdminUser.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users: users && users.length > 0 ? users : defaultUserList });
  } catch (error: any) {
    console.warn('Admin users DB warning (using default admin list):', error.message);
    return NextResponse.json({ users: defaultUserList });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  if (auth.session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Only Super Admins can create new administrators' }, { status: 403 });
  }

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    await connectToDatabase();
    const cleanEmail = email.trim().toLowerCase();

    const existing = await AdminUser.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await AdminUser.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: role || 'admin',
    });

    await ActivityLog.create({
      userEmail: auth.session.email,
      userName: auth.session.name,
      action: 'create',
      entityType: 'user',
      entityId: user._id.toString(),
      entityName: user.name,
      details: `Created new admin user "${user.name}" (${user.email}) with role ${user.role}`,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  if (auth.session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Only Super Admins can remove administrators' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (id === auth.session.id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await AdminUser.findByIdAndDelete(id);

    if (user) {
      await ActivityLog.create({
        userEmail: auth.session.email,
        userName: auth.session.name,
        action: 'delete',
        entityType: 'user',
        entityId: id,
        entityName: user.name,
        details: `Deleted admin user "${user.name}" (${user.email})`,
      });
    }

    return NextResponse.json({ success: true, message: 'Admin user deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
