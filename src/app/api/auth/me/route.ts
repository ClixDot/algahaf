import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import { AdminUser } from '../../../../models/AdminUser';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 1500)
    );
    await Promise.race([connectToDatabase(), timeoutPromise]);
    const user = await AdminUser.findById(session.id).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    // If JWT session is valid, return session user even if DB has a temporary timeout
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  }
}
