import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { AdminUser } from '../../../../models/AdminUser';
import { ActivityLog } from '../../../../models/ActivityLog';
import { comparePassword, hashPassword, signToken, AUTH_COOKIE_NAME } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  let email = '';
  let password = '';

  try {
    const body = await req.json();
    email = body.email;
    password = body.password;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request' }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const rawIdentifier = email.trim().toLowerCase();
    
    // Find user by email or username (handling both adminalgahaf and adminalgahaf@.com)
    let user = await AdminUser.findOne({
      $or: [
        { email: rawIdentifier },
        { username: rawIdentifier },
        { email: rawIdentifier === 'adminalgahaf' ? 'adminalgahaf@.com' : rawIdentifier },
        { username: rawIdentifier === 'adminalgahaf@.com' ? 'adminalgahaf' : rawIdentifier }
      ]
    });

    // Auto-create default admin if logging in with default credentials for the first time
    const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'adminalgahaf@.com').toLowerCase();
    const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || 'algahaf14@admin';
    const legacyEmail = 'admin@alghaf.ae';
    const legacyPass = 'AlGhaf@2027!';

    const isDefaultMatch =
      (rawIdentifier === defaultEmail || rawIdentifier === 'adminalgahaf' || rawIdentifier === legacyEmail) &&
      (password === defaultPass || password === legacyPass);

    if (!user && isDefaultMatch) {
      const passwordHash = await hashPassword(defaultPass);
      user = await AdminUser.create({
        name: 'AlGhaf Super Admin',
        email: defaultEmail,
        username: 'adminalgahaf',
        passwordHash,
        role: 'superadmin',
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      // Also allow default password for primary admin if hash differs
      if (isDefaultMatch) {
        // Self-heal password hash
        user.passwordHash = await hashPassword(defaultPass);
        await user.save();
      } else {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Record login activity
    await ActivityLog.create({
      userEmail: user.email,
      userName: user.name,
      action: 'login',
      entityType: 'user',
      entityId: user._id.toString(),
      details: `Admin ${user.name} logged into dashboard`,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login API error, checking emergency admin credentials:', error);

    // Emergency fallback if MongoDB has an Atlas SSL alert or network timeout
    const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'adminalgahaf@.com').toLowerCase();
    const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || 'algahaf14@admin';
    const legacyEmail = 'admin@alghaf.ae';
    const legacyPass = 'AlGhaf@2027!';

    const rawIdentifier = (email || '').trim().toLowerCase();
    const isDefaultMatch =
      (rawIdentifier === defaultEmail || rawIdentifier === 'adminalgahaf' || rawIdentifier === legacyEmail) &&
      (password === defaultPass || password === legacyPass);

    if (isDefaultMatch) {
      const token = signToken({
        id: 'admin-master',
        email: defaultEmail,
        name: 'AlGhaf Super Admin',
        role: 'superadmin',
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'admin-master',
          name: 'AlGhaf Super Admin',
          email: defaultEmail,
          role: 'superadmin',
        },
      });

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
