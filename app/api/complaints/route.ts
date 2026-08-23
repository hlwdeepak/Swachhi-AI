import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/utils';
import { classifyComplaint } from '@/ai/grievance-agent';
import { routeComplaint } from '@/ai/routing-agent';
import { generateTicketId } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { seedDatabase } from '@/database/seed';

export async function GET(req: NextRequest) {
  await seedDatabase();
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const db = getDb();
  const { searchParams } = new URL(req.url);
  const ward = searchParams.get('ward');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = 'SELECT * FROM complaints';
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (user.role === 'citizen') {
    conditions.push('user_id = ?');
    params.push(user.userId);
  }
  if (user.role === 'worker') {
    const worker = db.prepare('SELECT ward FROM workers WHERE name LIKE ?').get(`%${user.name}%`) as any;
    if (worker?.ward) {
      conditions.push('ward = ?');
      params.push(worker.ward);
    }
  }
  if (ward) { conditions.push('ward LIKE ?'); params.push(`%${ward}%`); }
  if (status) { conditions.push('status = ?'); params.push(status); }
  if (priority) { conditions.push('priority = ?'); params.push(priority); }
  if (category) { conditions.push('category = ?'); params.push(category); }

  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  const complaints = db.prepare(query).all(...params);
  return NextResponse.json({ complaints });
}

export async function POST(req: NextRequest) {
  await seedDatabase();
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const db = getDb();
  const body = await req.json();
  const { description, latitude, longitude, address, ward, image_url } = body;

  if (!description) {
    return NextResponse.json({ error: 'Description is required' }, { status: 400 });
  }

  const id = uuidv4();
  const ticketId = generateTicketId();

  // Step 1: Insert as submitted
  db.prepare(`
    INSERT INTO complaints (id, ticket_id, user_id, category, subcategory, description, original_language, latitude, longitude, address, ward, priority, status, created_at, updated_at)
    VALUES (?, ?, ?, 'Waste Collection', 'General', ?, 'en', ?, ?, ?, ?, 'medium', 'submitted', datetime('now'), datetime('now'))
  `).run(id, ticketId, user.userId, description, latitude || null, longitude || null, address || null, ward || null);

  db.prepare(`INSERT INTO complaint_timeline (id, complaint_id, status, note, actor_role, created_at) VALUES (?, ?, 'submitted', 'Complaint submitted by citizen', 'citizen', datetime('now'))`).run(uuidv4(), id);

  // Step 2: AI classification
  db.prepare(`UPDATE complaints SET status = 'ai_processing', updated_at = datetime('now') WHERE id = ?`).run(id);

  const classification = await classifyComplaint(description);

  db.prepare(`UPDATE complaints SET status = 'classified', updated_at = datetime('now') WHERE id = ?`).run(id);
  db.prepare(`INSERT INTO complaint_timeline (id, complaint_id, status, note, actor_role) VALUES (?, ?, 'classified', ?, 'system')`).run(uuidv4(), id, `AI classified as ${classification.category} — ${classification.priority} priority`);

  // Step 3: Routing
  const routing = routeComplaint({
    category: classification.category,
    subcategory: classification.subcategory,
    priority: classification.priority,
    ward: classification.ward || ward,
    description,
  });

  const wardFinal = classification.ward || ward || routing.ward;

  db.prepare(`
    UPDATE complaints SET
      category = ?, subcategory = ?, original_language = ?, translated_description = ?,
      priority = ?, priority_reason = ?, ward = ?,
      assigned_team = ?, ai_classification = ?, ai_routing_explanation = ?,
      image_url = ?, status = 'assigned', updated_at = datetime('now')
    WHERE id = ?
  `).run(
    classification.category, classification.subcategory, classification.language,
    classification.description_en, classification.priority, classification.priority_reason,
    wardFinal, routing.team, JSON.stringify(classification), routing.explanation,
    image_url || null, id
  );

  db.prepare(`INSERT INTO complaint_timeline (id, complaint_id, status, note, actor_role) VALUES (?, ?, 'assigned', ?, 'system')`).run(uuidv4(), id, `Assigned to ${routing.team} — ${routing.explanation}`);

  // Update ward count
  if (wardFinal) {
    db.prepare(`UPDATE wards SET complaint_count = complaint_count + 1 WHERE name = ?`).run(wardFinal);
  }

  // Notification to citizen
  db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, 'info')`).run(
    uuidv4(), user.userId,
    `Complaint ${ticketId} Assigned`,
    `Your complaint has been classified as ${classification.priority} priority and assigned to ${routing.team}.`
  );

  const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
  return NextResponse.json({ complaint, classification, routing }, { status: 201 });
}
