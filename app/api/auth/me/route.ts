import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/utils';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const db = getDb();
  const u = db.prepare('SELECT id, name, email, role, language, ward, phone, created_at FROM users WHERE id = ?').get(user.userId) as any;
  if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user: u });
}
