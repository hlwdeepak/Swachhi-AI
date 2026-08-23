import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/database/seed';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await seedDatabase();
  const db = getDb();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
  const res = NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, language: user.language, ward: user.ward },
  });
  res.cookies.set('swachhai_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
