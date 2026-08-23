'use client';

import { AnalyticsOverview, Complaint, Notification, User, WardStat, Worker } from './types';
import { classifyComplaint } from '../ai/grievance-agent';
import { routeComplaint } from '../ai/routing-agent';
import { optimizeRoute } from '../ai/route-agent';
import { classifyWasteDemo } from '../ai/segregation-agent';
import { generateInsight } from '../ai/analytics-agent';

const SEED_WARDS: WardStat[] = [
  { ward: 'Ward 1 — Maninagar', total: 14, pending: 3, resolved: 11, high_priority: 2, segregation_rate: 0.72, resolution_rate: 0.79 },
  { ward: 'Ward 2 — Naranpura', total: 18, pending: 5, resolved: 13, high_priority: 1, segregation_rate: 0.65, resolution_rate: 0.72 },
  { ward: 'Ward 3 — Bopal', total: 9, pending: 1, resolved: 8, high_priority: 0, segregation_rate: 0.88, resolution_rate: 0.89 },
  { ward: 'Ward 4 — Gota', total: 22, pending: 8, resolved: 14, high_priority: 4, segregation_rate: 0.55, resolution_rate: 0.64 },
  { ward: 'Ward 5 — Vastral', total: 16, pending: 4, resolved: 12, high_priority: 2, segregation_rate: 0.61, resolution_rate: 0.75 },
  { ward: 'Ward 6 — Chandkheda', total: 12, pending: 2, resolved: 10, high_priority: 1, segregation_rate: 0.79, resolution_rate: 0.83 },
  { ward: 'Ward 7 — Nikol', total: 28, pending: 9, resolved: 19, high_priority: 5, segregation_rate: 0.48, resolution_rate: 0.68 },
  { ward: 'Ward 8 — Vatva', total: 20, pending: 6, resolved: 14, high_priority: 3, segregation_rate: 0.58, resolution_rate: 0.70 },
  { ward: 'Ward 9 — Satellite', total: 11, pending: 1, resolved: 10, high_priority: 0, segregation_rate: 0.91, resolution_rate: 0.91 },
  { ward: 'Ward 10 — Odhav', total: 24, pending: 7, resolved: 17, high_priority: 3, segregation_rate: 0.52, resolution_rate: 0.71 },
  { ward: 'Ward 11 — Bapunagar', total: 26, pending: 8, resolved: 18, high_priority: 4, segregation_rate: 0.63, resolution_rate: 0.69 },
  { ward: 'Ward 12 — Rakhial', total: 31, pending: 11, resolved: 20, high_priority: 6, segregation_rate: 0.44, resolution_rate: 0.65 },
];

const SEED_WORKERS: Worker[] = [
  { id: 'wk-01', name: 'Ramesh Patel', team: 'Collection Team Alpha', phone: '+91 98765 43210', ward: 'Ward 12 — Rakhial', current_lat: 23.062, current_lng: 72.638, availability: 'available', created_at: new Date().toISOString() },
  { id: 'wk-02', name: 'Suresh Sharma', team: 'Collection Team Beta', phone: '+91 98765 43211', ward: 'Ward 7 — Nikol', current_lat: 23.044, current_lng: 72.649, availability: 'on_duty', created_at: new Date().toISOString() },
  { id: 'wk-03', name: 'Amitbhai Joshi', team: 'Rapid Response Team', phone: '+91 98765 43212', ward: 'Ward 4 — Gota', current_lat: 23.100, current_lng: 72.530, availability: 'available', created_at: new Date().toISOString() },
  { id: 'wk-04', name: 'Kiran Desai', team: 'Collection Team Gamma', phone: '+91 98765 43213', ward: 'Ward 8 — Vatva', current_lat: 22.953, current_lng: 72.630, availability: 'available', created_at: new Date().toISOString() },
  { id: 'wk-05', name: 'Bhavesh Mehta', team: 'Enforcement Team', phone: '+91 98765 43214', ward: 'Ward 11 — Bapunagar', current_lat: 23.048, current_lng: 72.623, availability: 'off_duty', created_at: new Date().toISOString() },
  { id: 'wk-06', name: 'Nilesh Thakur', team: 'Compliance Team', phone: '+91 98765 43215', ward: 'Ward 2 — Naranpura', current_lat: 23.051, current_lng: 72.556, availability: 'available', created_at: new Date().toISOString() },
];

const SEED_USERS: User[] = [
  { id: 'usr-citizen-01', name: 'Priya Sharma', email: 'citizen@demo.com', role: 'citizen', language: 'en', ward: 'Ward 12 — Rakhial', created_at: new Date().toISOString() },
  { id: 'usr-officer-01', name: 'Rajesh Verma (Officer)', email: 'officer@demo.com', role: 'officer', language: 'en', ward: 'AMC Central', created_at: new Date().toISOString() },
  { id: 'usr-worker-01', name: 'Ramesh Patel', email: 'worker@demo.com', role: 'worker', language: 'en', ward: 'Ward 12 — Rakhial', created_at: new Date().toISOString() },
];

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'c1', ticket_id: 'SWACHH-1001', user_id: 'usr-citizen-01',
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'અમારા વિસ્તારમાં ત્રણ દિવસથી કચરો ઉપાડવા કોઈ આવ્યું નથી.',
    original_language: 'gu', translated_description: 'No one has come to collect garbage in our area for three days.',
    ward: 'Ward 12 — Rakhial', latitude: 23.062, longitude: 72.638,
    priority: 'critical', priority_reason: 'Missed household collection directly affects public health and sanitation.',
    status: 'assigned', assigned_team: 'Collection Team Alpha',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(), updated_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'c2', ticket_id: 'SWACHH-1002', user_id: 'usr-citizen-01',
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'गली नंबर 5 में पिछले 2 दिनों से कचरा नहीं उठाया गया है।',
    original_language: 'hi', translated_description: 'Garbage has not been collected from street number 5 for the past 2 days.',
    ward: 'Ward 7 — Nikol', latitude: 23.044, longitude: 72.649,
    priority: 'high', priority_reason: 'Uncollected domestic waste leading to odor and pest risks.',
    status: 'in_progress', assigned_team: 'Collection Team Beta',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(), updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'c3', ticket_id: 'SWACHH-1003', user_id: 'usr-citizen-01',
    category: 'Illegal Dumping', subcategory: 'Roadside Dumping',
    description: 'Large pile of construction waste dumped on main road near Ward 4 market.',
    original_language: 'en',
    ward: 'Ward 4 — Gota', latitude: 23.100, longitude: 72.530,
    priority: 'high', priority_reason: 'Obstruction of traffic and environmental hazard.',
    status: 'assigned', assigned_team: 'Enforcement Team',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(), updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'c4', ticket_id: 'SWACHH-1004', user_id: 'usr-citizen-01',
    category: 'Waste Collection', subcategory: 'Overflowing Bin',
    description: 'Community bin at Rakhial crossroad is overflowing since yesterday morning.',
    original_language: 'en',
    ward: 'Ward 12 — Rakhial', latitude: 23.064, longitude: 72.635,
    priority: 'high', priority_reason: 'Overflowing bins attract stray animals and cause litter.',
    status: 'submitted',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'c5', ticket_id: 'SWACHH-1005', user_id: 'usr-citizen-01',
    category: 'Segregation', subcategory: 'Improper Segregation',
    description: 'Residents in Block C are not separating wet and dry waste despite notices.',
    original_language: 'en',
    ward: 'Ward 2 — Naranpura', latitude: 23.051, longitude: 72.556,
    priority: 'medium', priority_reason: 'Mixed waste impacts recycling and processing plants.',
    status: 'resolved', assigned_team: 'Compliance Team',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), updated_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'c6', ticket_id: 'SWACHH-1006', user_id: 'usr-citizen-01',
    category: 'Waste Collection', subcategory: 'Missed Collection',
    description: 'Nikol sector 3 has missed collection for 4 consecutive days.',
    original_language: 'en',
    ward: 'Ward 7 — Nikol', latitude: 23.042, longitude: 72.651,
    priority: 'critical', priority_reason: 'Prolonged failure in door-to-door sanitation.',
    status: 'escalated', assigned_team: 'Rapid Response Team',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(), updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export function initClientMock() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('swachhai_users')) {
    localStorage.setItem('swachhai_users', JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem('swachhai_complaints')) {
    localStorage.setItem('swachhai_complaints', JSON.stringify(SEED_COMPLAINTS));
  }
  if (!localStorage.getItem('swachhai_workers')) {
    localStorage.setItem('swachhai_workers', JSON.stringify(SEED_WORKERS));
  }
  if (!localStorage.getItem('swachhai_wards')) {
    localStorage.setItem('swachhai_wards', JSON.stringify(SEED_WARDS));
  }

  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
    
    // Check if this is an API call
    if (urlStr.includes('/api/')) {
      const parsedUrl = new URL(urlStr, window.location.origin);
      const pathname = parsedUrl.pathname.replace(/^.*\/api\//, '/api/');

      try {
        const response = await handleMockApi(pathname, parsedUrl, init);
        if (response) return response;
      } catch (err) {
        console.warn('Mock API error, falling back:', err);
      }
    }

    return originalFetch(input, init);
  };
}

async function handleMockApi(pathname: string, url: URL, init?: RequestInit): Promise<Response | null> {
  const method = (init?.method || 'GET').toUpperCase();
  const getStored = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
  const setStored = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

  // Current user from auth state
  const currentUser: User | null = JSON.parse(localStorage.getItem('swachhai_current_user') || 'null');

  // /api/auth/me
  if (pathname === '/api/auth/me') {
    return new Response(JSON.stringify({ user: currentUser }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/auth/login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = init?.body ? JSON.parse(init.body as string) : {};
    const users = getStored('swachhai_users') as User[];
    let user = users.find((u) => u.email.toLowerCase() === (body.email || '').toLowerCase());
    
    if (!user) {
      // Auto-create for demo convenience if ends with demo.com
      const role = body.email.includes('officer') ? 'officer' : body.email.includes('worker') ? 'worker' : 'citizen';
      user = { id: `usr-${Date.now()}`, name: body.email.split('@')[0], email: body.email, role, language: 'en', ward: 'Ward 12 — Rakhial', created_at: new Date().toISOString() };
      users.push(user);
      setStored('swachhai_users', users);
    }

    localStorage.setItem('swachhai_current_user', JSON.stringify(user));
    return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/auth/logout
  if (pathname === '/api/auth/logout') {
    localStorage.removeItem('swachhai_current_user');
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/auth/register
  if (pathname === '/api/auth/register' && method === 'POST') {
    const body = init?.body ? JSON.parse(init.body as string) : {};
    const users = getStored('swachhai_users') as User[];
    const user: User = {
      id: `usr-${Date.now()}`,
      name: body.name || 'Citizen',
      email: body.email,
      role: body.role || 'citizen',
      language: body.language || 'en',
      ward: body.ward || 'Ward 12 — Rakhial',
      phone: body.phone,
      created_at: new Date().toISOString(),
    };
    users.push(user);
    setStored('swachhai_users', users);
    localStorage.setItem('swachhai_current_user', JSON.stringify(user));
    return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/complaints
  if (pathname === '/api/complaints') {
    const complaints: Complaint[] = getStored('swachhai_complaints');

    if (method === 'GET') {
      const ward = url.searchParams.get('ward');
      const status = url.searchParams.get('status');
      const priority = url.searchParams.get('priority');

      let filtered = [...complaints];
      if (currentUser?.role === 'citizen') {
        filtered = filtered.filter((c) => c.user_id === currentUser.id || c.user_id === 'usr-citizen-01');
      }
      if (ward) filtered = filtered.filter((c) => (c.ward || '').toLowerCase().includes(ward.toLowerCase()));
      if (status) filtered = filtered.filter((c) => c.status === status);
      if (priority) filtered = filtered.filter((c) => c.priority === priority);

      return new Response(JSON.stringify({ complaints: filtered }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'POST') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const classification = await classifyComplaint(body.description || '');
      const routing = routeComplaint({
        category: classification.category,
        subcategory: classification.subcategory,
        priority: classification.priority,
        ward: classification.ward || body.ward || 'Ward 12 — Rakhial',
        description: body.description,
      });

      const newComplaint: Complaint = {
        id: `c-${Date.now()}`,
        ticket_id: `SWACHH-${Math.floor(1000 + Math.random() * 9000)}`,
        user_id: currentUser?.id || 'usr-citizen-01',
        category: classification.category,
        subcategory: classification.subcategory,
        description: body.description,
        original_language: classification.language,
        translated_description: classification.description_en,
        latitude: body.latitude || 23.062,
        longitude: body.longitude || 72.638,
        address: body.address || 'Rakhial Crossroad',
        ward: classification.ward || body.ward || routing.ward || 'Ward 12 — Rakhial',
        priority: classification.priority,
        priority_reason: classification.priority_reason,
        status: 'assigned',
        assigned_team: routing.team,
        ai_classification: JSON.stringify(classification),
        ai_routing_explanation: routing.explanation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      complaints.unshift(newComplaint);
      setStored('swachhai_complaints', complaints);

      return new Response(JSON.stringify({ complaint: newComplaint, classification, routing }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // /api/complaints/[id]
  const complaintMatch = pathname.match(/^\/api\/complaints\/([^/]+)$/);
  if (complaintMatch) {
    const id = complaintMatch[1];
    const complaints: Complaint[] = getStored('swachhai_complaints');
    const complaint = complaints.find((c) => c.id === id || c.ticket_id === id) || complaints[0];

    if (method === 'GET') {
      const timeline = [
        { id: 't1', complaint_id: complaint.id, status: 'submitted', note: 'Complaint submitted by citizen', actor_role: 'citizen', created_at: complaint.created_at },
        { id: 't2', complaint_id: complaint.id, status: 'classified', note: `AI classified as ${complaint.category} — ${complaint.priority} priority`, actor_role: 'system', created_at: complaint.created_at },
        { id: 't3', complaint_id: complaint.id, status: complaint.status, note: complaint.ai_routing_explanation || `Assigned to ${complaint.assigned_team || 'Collection Team Alpha'}`, actor_role: 'system', created_at: complaint.updated_at },
      ];
      return new Response(JSON.stringify({ complaint, timeline }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'PATCH') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      if (body.status) complaint.status = body.status;
      if (body.assigned_team) complaint.assigned_team = body.assigned_team;
      complaint.updated_at = new Date().toISOString();
      setStored('swachhai_complaints', complaints);
      return new Response(JSON.stringify({ complaint }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // /api/analytics
  if (pathname === '/api/analytics') {
    const complaints: Complaint[] = getStored('swachhai_complaints');
    const wards: WardStat[] = getStored('swachhai_wards');
    const total = complaints.length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    const high_priority = complaints.filter((c) => c.priority === 'critical' || c.priority === 'high').length;
    const pending = total - resolved;

    const overview: AnalyticsOverview = {
      total_complaints: total + 210,
      resolved_today: resolved + 12,
      pending: pending + 50,
      high_priority: high_priority + 25,
      avg_resolution_hours: 22.4,
      segregation_rate: 68.5,
      collection_efficiency: 76.2,
      ward_stats: wards,
      trend_data: [
        { date: 'Mon', complaints: 32, resolved: 28 },
        { date: 'Tue', complaints: 45, resolved: 38 },
        { date: 'Wed', complaints: 39, resolved: 35 },
        { date: 'Thu', complaints: 52, resolved: 44 },
        { date: 'Fri', complaints: 48, resolved: 42 },
        { date: 'Sat', complaints: 60, resolved: 50 },
        { date: 'Sun', complaints: 34, resolved: 31 },
      ],
      hotspots: [
        { lat: 23.062, lng: 72.638, ward: 'Ward 12 — Rakhial', intensity: 8, category: 'Waste Collection' },
        { lat: 23.044, lng: 72.649, ward: 'Ward 7 — Nikol', intensity: 7, category: 'Waste Collection' },
        { lat: 23.100, lng: 72.530, ward: 'Ward 4 — Gota', intensity: 6, category: 'Illegal Dumping' },
      ],
    };

    return new Response(JSON.stringify(overview), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/workers
  if (pathname === '/api/workers') {
    const workers: Worker[] = getStored('swachhai_workers');
    return new Response(JSON.stringify({ workers }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/notifications
  if (pathname === '/api/notifications') {
    const notifications: Notification[] = [
      { id: 'n1', user_id: currentUser?.id || 'usr-citizen-01', title: 'Route Optimized', message: 'Collection route updated for Ward 12 with 22% travel time reduction.', type: 'info', read: false, created_at: new Date().toISOString() },
      { id: 'n2', user_id: currentUser?.id || 'usr-citizen-01', title: 'Complaint Assigned', message: 'Your complaint SWACHH-1001 has been assigned to Collection Team Alpha.', type: 'info', read: false, created_at: new Date().toISOString() },
    ];
    return new Response(JSON.stringify({ notifications }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/routes
  if (pathname === '/api/routes') {
    const complaints: Complaint[] = getStored('swachhai_complaints');
    const result = optimizeRoute({
      ward: 'Ward 12 — Rakhial',
      team: 'Collection Team Alpha',
      complaints: complaints.slice(0, 6).map((c) => ({
        id: c.id,
        lat: c.latitude || 23.062,
        lng: c.longitude || 72.638,
        address: c.ward || 'Ahmedabad',
        priority: c.priority,
        category: c.category,
      })),
    });
    const routeObj = {
      id: 'rt-1',
      team: 'Collection Team Alpha',
      date: new Date().toISOString().split('T')[0],
      stops: result.optimized_stops,
      total_distance: result.optimized_distance,
      estimated_time: result.optimized_time,
      status: 'planned' as const,
      optimized: true,
      improvement_pct: result.improvement_pct,
      created_at: new Date().toISOString(),
    };
    return new Response(JSON.stringify({ routes: [routeObj], optimization: result }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/ai/classify
  if (pathname === '/api/ai/classify') {
    const body = init?.body ? JSON.parse(init.body as string) : {};
    const result = await classifyComplaint(body.text || '');
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/ai/copilot
  if (pathname === '/api/ai/copilot') {
    const body = init?.body ? JSON.parse(init.body as string) : {};
    const stats: AnalyticsOverview = {
      total_complaints: 260,
      resolved_today: 34,
      pending: 65,
      high_priority: 31,
      avg_resolution_hours: 22.4,
      segregation_rate: 68.5,
      collection_efficiency: 76.2,
      ward_stats: getStored('swachhai_wards'),
      trend_data: [],
      hotspots: [],
    };
    const response = generateInsight(stats, body.query || '');
    return new Response(JSON.stringify({ response, is_demo: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // /api/ai/segregation
  if (pathname === '/api/ai/segregation') {
    const body = init?.body ? JSON.parse(init.body as string) : {};
    const result = classifyWasteDemo(body.description || '');
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return null;
}
