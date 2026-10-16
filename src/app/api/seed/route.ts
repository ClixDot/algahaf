import { NextResponse } from 'next/server';
import { seedDatabase } from '../../../scripts/seed';

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Seed API error:', error);
    return NextResponse.json({ error: error.message || 'Seeding failed' }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
