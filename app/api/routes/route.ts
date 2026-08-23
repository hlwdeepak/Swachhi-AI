import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/utils';
import { optimizeRoute } from '@/ai/route-agent';
import { v4 as uuidv4 } from 'uuid';
import { seedDatabase } from '@/database/seed';

export async function POST(req: NextRequest) {
  await seedDatabase();
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const db = getDb();
  const body = await req.json();
  const { ward, team, vehicle } = body;

  // Fetch unresolved complaints with location
  let query = `SELECT id, category, latitude as lat, longitude as lng, address, ward, priority FROM complaints
    WHERE status NOT IN ('resolved') AND latitude IS NOT NULL`;
  const params: unknown[] = [];
  if (ward) { query += ' AND ward LIKE ?'; params.push(`%${ward}%`); }
  query += ' ORDER BY CASE priority WHEN \'critical\' THEN 1 WHEN \'high\' THEN 2 WHEN \'medium\' THEN 3 ELSE 4 END LIMIT 20';

  const complaints = db.prepare(query).all(...params) as any[];

  const result = optimizeRoute({
    ward,
    complaints: complaints.map((c) => ({
      id: c.id,
      lat: c.lat || 23.0225,
      lng: c.lng || 72.5714,
      address: c.address || c.ward || 'Unknown',
      priority: c.priority,
      category: c.category,
    })),
    team,
    vehicle,
  });

  // Save route
  const routeId = uuidv4();
  db.prepare(`
    INSERT INTO routes (id, team, date, stops, total_distance, estimated_time, status, optimized, improvement_pct)
    VALUES (?, ?, date('now'), ?, ?, ?, 'planned', 1, ?)
  `).run(routeId, team || result.team, JSON.stringify(result.optimized_stops), result.optimized_distance, result.optimized_time, result.improvement_pct);

  return NextResponse.json({ route_id: routeId, result });
}

export async function GET(req: NextRequest) {
  await seedDatabase();
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const db = getDb();
  const routes = db.prepare('SELECT * FROM routes ORDER BY created_at DESC LIMIT 10').all() as any[];
  return NextResponse.json({
    routes: routes.map((r) => ({
      ...r,
      stops: JSON.parse(r.stops || '[]'),
      optimized: Boolean(r.optimized),
    })),
  });
}
