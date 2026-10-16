import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'alghaf_collective_super_secret_jwt_key_2027_dubai';
export const AUTH_COOKIE_NAME = 'alghaf_admin_token';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'editor';
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export function getSessionFromRequest(req: NextRequest): AdminPayload | null {
  // Check cookie
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  if (cookie?.value) {
    const verified = verifyToken(cookie.value);
    if (verified) return verified;
  }

  // Check header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  return null;
}

export function requireAuth(req: NextRequest): { session: AdminPayload } | { errorResponse: NextResponse } {
  const session = getSessionFromRequest(req);
  if (!session) {
    return {
      errorResponse: NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 }),
    };
  }
  return { session };
}
