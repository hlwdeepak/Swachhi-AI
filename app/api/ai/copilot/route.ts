import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/utils';
import { generateInsight } from '@/ai/analytics-agent';
import { seedDatabase } from '@/database/seed';

export async function POST(req: NextRequest) {
  await seedDatabase();
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { query } = await req.json();
  const db = getDb();

  const stats = buildStats(db);
  const insight = generateInsight(stats, query || '');

  return NextResponse.json({ insight, stats, query });
}

function buildStats(db: any) {
  const total = (db.prepare('SELECT COUNT(*) as c FROM complaints').get() as any).c;
  const pending = (db.prepare("SELECT COUNT(*) as c FROM complaints WHERE status NOT IN ('resolved')").get() as any).c;
  const resolvedToday = (db.prepare("SELECT COUNT(*) as c FROM complaints WHERE status='resolved' AND date(resolved_at)=date('now')").get() as any).c;
  const highPriority = (db.prepare("SELECT COUNT(*) as c FROM complaints WHERE priority IN ('high','critical') AND status != 'resolved'").get() as any).c;

  const wardRows = db.prepare('SELECT * FROM wards').all() as any[];
  const ward_stats = wardRows.map((w: any) => {
    const wTotal = (db.prepare('SELECT COUNT(*) as c FROM complaints WHERE ward = ?').get(w.name) as any).c;
    const wResolved = (db.prepare("SELECT COUNT(*) as c FROM complaints WHERE ward = ? AND status = 'resolved'").get(w.name) as any).c;
    const wHigh = (db.prepare("SELECT COUNT(*) as c FROM complaints WHERE ward = ? AND priority IN ('high','critical') AND status != 'resolved'").get(w.name) as any).c;
    return {
      ward: w.name,
      total: wTotal,
      resolved: wResolved,
      pending: wTotal - wResolved,
      high_priority: wHigh,
      segregation_rate: w.segregation_rate,
      resolution_rate: wTotal > 0 ? wResolved / wTotal : 0,
    };
  });

  const trend_data = [];
  for (let i = 6; i >= 0; i--) {
    const d = (db.prepare(`SELECT COUNT(*) as c FROM complaints WHERE date(created_at) = date('now', '-${i} days')`).get() as any).c;
    const r = (db.prepare(`SELECT COUNT(*) as c FROM complaints WHERE date(resolved_at) = date('now', '-${i} days')`).get() as any).c;
    trend_data.push({ date: `Day -${i}`, complaints: d, resolved: r });
  }

  const hotspots = (db.prepare("SELECT latitude as lat, longitude as lng, ward, category, priority FROM complaints WHERE status != 'resolved' AND latitude IS NOT NULL").all() as any[]).map((c: any) => ({
    lat: c.lat, lng: c.lng, ward: c.ward, category: c.category,
    intensity: c.priority === 'critical' ? 1.0 : c.priority === 'high' ? 0.7 : 0.4,
  }));

  return {
    total_complaints: total,
    pending,
    resolved_today: resolvedToday,
    high_priority: highPriority,
    collection_efficiency: 74,
    segregation_rate: 67,
    avg_resolution_hours: 8,
    ward_stats,
    trend_data,
    hotspots,
  };
}
