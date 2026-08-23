import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/database/seed';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  await seedDatabase();
  const db = getDb();
  const body = await req.json();
  const { name, email, password, phone, role = 'citizen', language = 'en', ward } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();

  db.prepare(
    'INSERT INTO users (id, name, email, phone, password_hash, role, language, ward) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, name, email, phone || null, hash, role, language, ward || null);

  const token = signToken({ userId: id, email, role, name });
  const res = NextResponse.json({ success: true, user: { id, name, email, role, language, ward } });
  res.cookies.set('swachhai_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
