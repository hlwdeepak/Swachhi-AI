import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/utils';
import { seedDatabase } from '@/database/seed';

export async function GET(req: NextRequest) {
  await seedDatabase();
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const db = getDb();
  const notifications = db.prepare(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).all(user.userId);

  return NextResponse.json({ notifications });
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const db = getDb();
  db.prepare("UPDATE notifications SET read = 1 WHERE user_id = ?").run(user.userId);
  return NextResponse.json({ success: true });
}
