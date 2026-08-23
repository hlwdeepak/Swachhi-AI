/**
 * SWACHHAI AI — Database Seed
 * Creates demo wards, workers, users, complaints, routes, and notifications.
 */

import { getDb } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const WARDS = [
  { id: 'ward-01', name: 'Ward 1 — Maninagar', lat: 22.9974, lng: 72.6106, pop: 48200, seg: 0.72, eff: 0.81 },
  { id: 'ward-02', name: 'Ward 2 — Naranpura', lat: 23.0510, lng: 72.5561, pop: 52100, seg: 0.65, eff: 0.74 },
  { id: 'ward-03', name: 'Ward 3 — Bopal', lat: 23.0344, lng: 72.4688, pop: 39800, seg: 0.88, eff: 0.91 },
  { id: 'ward-04', name: 'Ward 4 — Gota', lat: 23.1000, lng: 72.5300, pop: 61200, seg: 0.55, eff: 0.68 },
  { id: 'ward-05', name: 'Ward 5 — Vastral', lat: 22.9900, lng: 72.6700, pop: 44300, seg: 0.61, eff: 0.77 },
  { id: 'ward-06', name: 'Ward 6 — Chandkheda', lat: 23.1167, lng: 72.5833, pop: 57800, seg: 0.79, eff: 0.85 },
  { id: 'ward-07', name: 'Ward 7 — Nikol', lat: 23.0443, lng: 72.6494, pop: 38900, seg: 0.48, eff: 0.62 },
  { id: 'ward-08', name: 'Ward 8 — Vatva', lat: 22.9533, lng: 72.6300, pop: 43100, seg: 0.58, eff: 0.71 },
  { id: 'ward-09', name: 'Ward 9 — Satellite', lat: 23.0317, lng: 72.5230, pop: 66700, seg: 0.91, eff: 0.94 },
  { id: 'ward-10', name: 'Ward 10 — Odhav', lat: 22.9830, lng: 72.6530, pop: 41200, seg: 0.52, eff: 0.67 },
  { id: 'ward-11', name: 'Ward 11 — Bapunagar', lat: 23.0480, lng: 72.6230, pop: 55400, seg: 0.63, eff: 0.73 },
  { id: 'ward-12', name: 'Ward 12 — Rakhial', lat: 23.0620, lng: 72.6380, pop: 49800, seg: 0.44, eff: 0.59 },
];

const WORKERS = [
  { id: 'wk-01', name: 'Ramesh Patel', team: 'Collection Team Alpha', ward: 'Ward 12 — Rakhial', lat: 23.062, lng: 72.638 },
  { id: 'wk-02', name: 'Suresh Sharma', team: 'Collection Team Beta', ward: 'Ward 7 — Nikol', lat: 23.044, lng: 72.649 },
  { id: 'wk-03', name: 'Amitbhai Joshi', team: 'Rapid Response Team', ward: 'Ward 4 — Gota', lat: 23.100, lng: 72.530 },
  { id: 'wk-04', name: 'Kiran Desai', team: 'Collection Team Gamma', ward: 'Ward 8 — Vatva', lat: 22.953, lng: 72.630 },
  { id: 'wk-05', name: 'Bhavesh Mehta', team: 'Enforcement Team', ward: 'Ward 11 — Bapunagar', lat: 23.048, lng: 72.623 },
  { id: 'wk-06', name: 'Nilesh Thakur', team: 'Compliance Team', ward: 'Ward 2 — Naranpura', lat: 23.051, lng: 72.556 },
];

interface ComplaintSeed {
  category: string;
  subcategory: string;
  description: string;
  language: string;
  ward: string;
  wardId: string;
  lat: number;
  lng: number;
  priority: string;
  status: string;
  assigned_team?: string;
}

const COMPLAINT_TEMPLATES: ComplaintSeed[] = [
  {
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'અમારા વિસ્તારમાં ત્રણ દિવસથી કચરો ઉપાડવા કોઈ આવ્યું નથી.',
    language: 'gu', ward: 'Ward 12 — Rakhial', wardId: 'ward-12',
    lat: 23.062, lng: 72.638, priority: 'critical', status: 'assigned',
    assigned_team: 'Collection Team Alpha',
  },
  {
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'गली नंबर 5 में पिछले 2 दिनों से कचरा नहीं उठाया गया है।',
    language: 'hi', ward: 'Ward 7 — Nikol', wardId: 'ward-07',
    lat: 23.044, lng: 72.649, priority: 'high', status: 'in_progress',
    assigned_team: 'Collection Team Beta',
  },
  {
    category: 'Illegal Dumping', subcategory: 'Roadside Dumping',
    description: 'Large pile of construction waste dumped on main road near Ward 4 market.',
    language: 'en', ward: 'Ward 4 — Gota', wardId: 'ward-04',
    lat: 23.100, lng: 72.530, priority: 'high', status: 'assigned',
    assigned_team: 'Enforcement Team',
  },
  {
    category: 'Waste Collection', subcategory: 'Overflowing Bin',
    description: 'Community bin at Rakhial crossroad is overflowing since yesterday morning.',
    language: 'en', ward: 'Ward 12 — Rakhial', wardId: 'ward-12',
    lat: 23.064, lng: 72.635, priority: 'high', status: 'submitted',
  },
  {
    category: 'Segregation', subcategory: 'Improper Segregation',
    description: 'Residents in Block C are not separating wet and dry waste despite notices.',
    language: 'en', ward: 'Ward 2 — Naranpura', wardId: 'ward-02',
    lat: 23.051, lng: 72.556, priority: 'medium', status: 'resolved',
    assigned_team: 'Compliance Team',
  },
  {
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'Nikol sector 3 has missed collection for 4 consecutive days.',
    language: 'en', ward: 'Ward 7 — Nikol', wardId: 'ward-07',
    lat: 23.042, lng: 72.651, priority: 'critical', status: 'escalated',
    assigned_team: 'Rapid Response Team',
  },
  {
    category: 'Sanitation', subcategory: 'Blocked Drain',
    description: 'Waste blocking storm drain causing stagnant water on street.',
    language: 'en', ward: 'Ward 8 — Vatva', wardId: 'ward-08',
    lat: 22.954, lng: 72.631, priority: 'high', status: 'in_progress',
    assigned_team: 'Sanitation Response Team',
  },
  {
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'Bapunagar area missed collection — smell affecting nearby residents.',
    language: 'en', ward: 'Ward 11 — Bapunagar', wardId: 'ward-11',
    lat: 23.049, lng: 72.622, priority: 'high', status: 'assigned',
    assigned_team: 'Collection Team Gamma',
  },
  {
    category: 'Segregation', subcategory: 'Improper Segregation',
    description: 'Hazardous medical waste found in regular bin near clinic.',
    language: 'en', ward: 'Ward 1 — Maninagar', wardId: 'ward-01',
    lat: 22.998, lng: 72.611, priority: 'critical', status: 'escalated',
    assigned_team: 'Enforcement Team',
  },
  {
    category: 'Waste Collection', subcategory: 'General Complaint',
    description: 'Weekly schedule not being followed in residential colony.',
    language: 'en', ward: 'Ward 3 — Bopal', wardId: 'ward-03',
    lat: 23.035, lng: 72.469, priority: 'low', status: 'resolved',
    assigned_team: 'Collection Team Alpha',
  },
  {
    category: 'Illegal Dumping', subcategory: 'Roadside Dumping',
    description: 'Old furniture and household waste dumped on footpath near park.',
    language: 'en', ward: 'Ward 6 — Chandkheda', wardId: 'ward-06',
    lat: 23.117, lng: 72.584, priority: 'medium', status: 'submitted',
  },
  {
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'ઓઢવ વિસ્તારમાં ગઈ કાલથી ગાડી આવી નથી, કચરો ભેગો થઈ ગયો છે.',
    language: 'gu', ward: 'Ward 10 — Odhav', wardId: 'ward-10',
    lat: 22.983, lng: 72.653, priority: 'high', status: 'classified',
    assigned_team: 'Collection Team Beta',
  },
  {
    category: 'Sanitation', subcategory: 'Public Cleanliness',
    description: 'Market area waste not cleared after weekend — strong odor.',
    language: 'en', ward: 'Ward 5 — Vastral', wardId: 'ward-05',
    lat: 22.991, lng: 72.671, priority: 'medium', status: 'assigned',
    assigned_team: 'Collection Team Gamma',
  },
  {
    category: 'Waste Collection', subcategory: 'Overflowing Bin',
    description: 'बापूनगर में कूड़ेदान भर गया है, अब बाहर ढेर लग रहा है।',
    language: 'hi', ward: 'Ward 11 — Bapunagar', wardId: 'ward-11',
    lat: 23.047, lng: 72.624, priority: 'high', status: 'in_progress',
    assigned_team: 'Collection Team Gamma',
  },
  {
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'Gota sector 8 residential area — garbage not collected since Monday.',
    language: 'en', ward: 'Ward 4 — Gota', wardId: 'ward-04',
    lat: 23.102, lng: 72.528, priority: 'high', status: 'submitted',
  },
];

export async function seedDatabase() {
  const db = getDb();

  // Check if already seeded
  const count = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
  if (count > 0) return;

  console.log('[Seed] Seeding database...');

  // Seed wards
  const insertWard = db.prepare(`
    INSERT OR IGNORE INTO wards (id, name, city, population, complaint_count, resolved_count, segregation_rate, collection_efficiency, latitude, longitude)
    VALUES (?, ?, 'Ahmedabad', ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const w of WARDS) {
    const complaints = Math.floor(Math.random() * 15) + 5;
    const resolved = Math.floor(complaints * w.eff);
    insertWard.run(w.id, w.name, w.pop, complaints, resolved, w.seg, w.eff, w.lat, w.lng);
  }

  // Seed users
  const hash = await bcrypt.hash('Demo@123', 10);
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, phone, password_hash, role, language, ward)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('user-citizen-01', 'Priya Shah', 'citizen@demo.com', '9876543210', hash, 'citizen', 'gu', 'Ward 12 — Rakhial');
  insertUser.run('user-citizen-02', 'Rahul Mehta', 'rahul@demo.com', '9876543211', hash, 'citizen', 'hi', 'Ward 7 — Nikol');
  insertUser.run('user-officer-01', 'Municipal Officer Ahmedabad', 'officer@demo.com', '9876543220', hash, 'officer', 'en', 'All');
  insertUser.run('user-worker-01', 'Field Worker Ramesh', 'worker@demo.com', '9876543230', hash, 'worker', 'en', 'Ward 12 — Rakhial');

  // Seed workers
  const insertWorker = db.prepare(`
    INSERT OR IGNORE INTO workers (id, name, team, phone, ward, current_lat, current_lng, availability)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const w of WORKERS) {
    insertWorker.run(w.id, w.name, w.team, '98765432' + w.id.slice(-2), w.ward, w.lat, w.lng, 'available');
  }

  // Seed complaints
  const insertComplaint = db.prepare(`
    INSERT OR IGNORE INTO complaints
    (id, ticket_id, user_id, category, subcategory, description, original_language, ward, latitude, longitude, priority, status, assigned_team, ai_classification, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?), datetime('now', ?))
  `);

  const insertTimeline = db.prepare(`
    INSERT INTO complaint_timeline (id, complaint_id, status, note, actor_role, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', ?))
  `);

  const daysAgo = ['-8 days', '-7 days', '-6 days', '-5 days', '-4 days', '-3 days', '-2 days', '-1 days', '-12 hours', '-6 hours', '-4 hours', '-2 hours', '-1 hours', '-30 minutes', '-10 minutes'];

  for (let i = 0; i < COMPLAINT_TEMPLATES.length; i++) {
    const t = COMPLAINT_TEMPLATES[i];
    const id = `comp-${String(i + 1).padStart(3, '0')}`;
    const ticketId = `SW-2025-${10000 + i + 1}`;
    const userId = i % 3 === 0 ? 'user-citizen-01' : 'user-citizen-02';
    const dOffset = daysAgo[i % daysAgo.length];
    const aiClass = JSON.stringify({ category: t.category, subcategory: t.subcategory, priority: t.priority });

    insertComplaint.run(id, ticketId, userId, t.category, t.subcategory, t.description, t.language, t.ward, t.lat, t.lng, t.priority, t.status, t.assigned_team || null, aiClass, dOffset, dOffset);
    insertTimeline.run(uuidv4(), id, 'submitted', 'Complaint submitted by citizen', 'citizen', dOffset);

    if (['classified', 'assigned', 'in_progress', 'resolved', 'escalated'].includes(t.status)) {
      insertTimeline.run(uuidv4(), id, 'classified', 'AI classified and prioritized complaint', 'system', dOffset);
    }
    if (['assigned', 'in_progress', 'resolved'].includes(t.status) && t.assigned_team) {
      insertTimeline.run(uuidv4(), id, 'assigned', `Assigned to ${t.assigned_team}`, 'officer', dOffset);
    }
    if (['in_progress', 'resolved'].includes(t.status)) {
      insertTimeline.run(uuidv4(), id, 'in_progress', 'Field team en route', 'worker', '-1 hours');
    }
    if (t.status === 'resolved') {
      insertComplaint.run; // already inserted
      db.prepare(`UPDATE complaints SET resolved_at = datetime('now', '-30 minutes') WHERE id = ?`).run(id);
      insertTimeline.run(uuidv4(), id, 'resolved', 'Waste collected and area cleared', 'worker', '-30 minutes');
    }
  }

  // Seed demo route
  const routeStops = JSON.stringify([
    { order: 0, type: 'depot', label: 'AMC Depot', address: 'AMC Main Depot', lat: 23.0225, lng: 72.5714 },
    { order: 1, type: 'complaint', label: 'Missed Collection', address: 'Rakhial Road, Ward 12', lat: 23.062, lng: 72.638, priority: 'critical' },
    { order: 2, type: 'complaint', label: 'Overflowing Bin', address: 'Crossroads, Ward 12', lat: 23.064, lng: 72.635, priority: 'high' },
    { order: 3, type: 'collection', label: 'Regular Collection Point', address: 'Ward 12 Street 4', lat: 23.060, lng: 72.640 },
    { order: 4, type: 'collection', label: 'Collection Point B', address: 'Ward 11 Street 2', lat: 23.048, lng: 72.622 },
    { order: 5, type: 'transfer', label: 'Transfer Station', address: 'City Waste Transfer', lat: 23.028, lng: 72.577 },
  ]);

  db.prepare(`
    INSERT OR IGNORE INTO routes (id, worker_id, team, date, stops, total_distance, estimated_time, status, optimized, improvement_pct, created_at)
    VALUES (?, ?, ?, date('now'), ?, ?, ?, 'planned', 1, 18.5, datetime('now'))
  `).run('route-demo-01', 'wk-01', 'Collection Team Alpha', routeStops, 12.4, 52);

  // Seed notifications
  const insertNotif = db.prepare(`
    INSERT OR IGNORE INTO notifications (id, user_id, title, message, type, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);

  insertNotif.run(uuidv4(), 'user-citizen-01', 'Complaint Assigned', 'Your complaint #SW-2025-10001 has been assigned to Collection Team Alpha.', 'info', 0, '-2 hours');
  insertNotif.run(uuidv4(), 'user-citizen-01', 'In Progress', 'Our team is en route to resolve your complaint #SW-2025-10001.', 'info', 0, '-1 hours');
  insertNotif.run(uuidv4(), 'user-citizen-02', 'Complaint Resolved', 'Your complaint #SW-2025-10002 has been resolved. Thank you for reporting.', 'success', 0, '-30 minutes');
  insertNotif.run(uuidv4(), 'user-worker-01', 'New High Priority Task', 'New critical task assigned in Ward 12 — Rakhial. Please respond immediately.', 'warning', 0, '-3 hours');
  insertNotif.run(uuidv4(), 'user-officer-01', 'Alert: Ward 12', 'Ward 12 has 4 unresolved high-priority complaints. Immediate action recommended.', 'warning', 0, '-4 hours');

  console.log('[Seed] Database seeded successfully.');
}
