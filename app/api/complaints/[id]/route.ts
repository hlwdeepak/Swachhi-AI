import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export function generateStaticParams() {
  return [
    { id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }, { id: 'c5' },
    { id: 'c6' }, { id: 'c7' }, { id: 'c8' }, { id: 'c9' }, { id: 'c10' },
    { id: 'c11' }, { id: 'c12' }, { id: 'c13' }, { id: 'c14' }, { id: 'c15' },
    { id: 'demo' },
  ];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const db = getDb();
  const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(params.id) as any;
  if (!complaint) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const timeline = db.prepare('SELECT * FROM complaint_timeline WHERE complaint_id = ? ORDER BY created_at ASC').all(params.id);
  return NextResponse.json({ complaint, timeline });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (user.role === 'citizen') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const db = getDb();
  const { status, note, assigned_team, assigned_worker_id } = await req.json();

  const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(params.id) as any;
  if (!complaint) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updates: string[] = ['updated_at = datetime(\'now\')'];
  const vals: unknown[] = [];

  if (status) { updates.push('status = ?'); vals.push(status); }
  if (assigned_team) { updates.push('assigned_team = ?'); vals.push(assigned_team); }
  if (assigned_worker_id) { updates.push('assigned_worker_id = ?'); vals.push(assigned_worker_id); }
  if (status === 'resolved') { updates.push("resolved_at = datetime('now')"); }

  vals.push(params.id);
  db.prepare(`UPDATE complaints SET ${updates.join(', ')} WHERE id = ?`).run(...vals);

  if (status) {
    db.prepare('INSERT INTO complaint_timeline (id, complaint_id, status, note, actor_id, actor_role) VALUES (?, ?, ?, ?, ?, ?)').run(
      uuidv4(), params.id, status, note || null, user.userId, user.role
    );

    // Update ward resolved count
    if (status === 'resolved' && complaint.ward) {
      db.prepare('UPDATE wards SET resolved_count = resolved_count + 1 WHERE name = ?').run(complaint.ward);
    }

    // Notify citizen
    const messages: Record<string, string> = {
      in_progress: `Team is on the way to resolve ${complaint.ticket_id}.`,
      resolved: `Your complaint ${complaint.ticket_id} has been resolved. Thank you!`,
      escalated: `Complaint ${complaint.ticket_id} has been escalated for urgent review.`,
    };
    if (messages[status]) {
      db.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)').run(
        uuidv4(), complaint.user_id,
        `Update: ${complaint.ticket_id}`,
        messages[status],
        status === 'resolved' ? 'success' : 'info'
      );
    }
  }

  const updated = db.prepare('SELECT * FROM complaints WHERE id = ?').get(params.id);
  return NextResponse.json({ complaint: updated });
}
