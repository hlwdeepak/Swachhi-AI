import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/utils';
import { seedDatabase } from '@/database/seed';

export async function GET(req: NextRequest) {
  await seedDatabase();
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const db = getDb();
  const workers = db.prepare('SELECT id, name, team, phone, ward, current_lat, current_lng, availability FROM workers').all();
  return NextResponse.json({ workers });
}
