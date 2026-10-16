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
    const cleanEmail = email.trim().toLowerCase();
    let user = await AdminUser.findOne({ email: cleanEmail });

    // Auto-create default admin if logging in with env credentials for the first time
    const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@alghaf.ae').toLowerCase();
    const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || 'AlGhaf@2027!';

    if (!user && cleanEmail === defaultEmail && password === defaultPass) {
      const passwordHash = await hashPassword(defaultPass);
      user = await AdminUser.create({
        name: 'AlGhaf Super Admin',
        email: defaultEmail,
        passwordHash,
        role: 'superadmin',
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
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
    const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@alghaf.ae').toLowerCase();
    const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || 'AlGhaf@2027!';

    if (email?.trim().toLowerCase() === defaultEmail && password === defaultPass) {
        const token = signToken({
          id: 'admin-master',
          email: defaultEmail,
          name: 'AlGhaf Master Admin',
          role: 'superadmin',
        });

        const response = NextResponse.json({
          success: true,
          user: {
            id: 'admin-master',
            name: 'AlGhaf Master Admin',
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
