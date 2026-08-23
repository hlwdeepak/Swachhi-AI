'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Card, KpiCard, PriorityBadge, StatusBadge, Spinner, AIBadge, EmptyState } from '@/components/ui';
import { timeAgo } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts';

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-400">Loading map…</div> });

type Tab = 'overview' | 'complaints' | 'routes' | 'analytics' | 'copilot';

export default function OfficerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filters
  const [filterWard, setFilterWard] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && user.role === 'citizen') router.push('/dashboard/citizen');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      fetchComplaints();
      fetchWorkers();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    const res = await fetch('/api/analytics');
    if (res.ok) setAnalytics(await res.json());
  };

  const fetchComplaints = async () => {
    setLoadingData(true);
    const params = new URLSearchParams();
    if (filterWard) params.set('ward', filterWard);
    if (filterStatus) params.set('status', filterStatus);
    if (filterPriority) params.set('priority', filterPriority);
    const res = await fetch(`/api/complaints?${params}&limit=50`);
    const data = await res.json();
    setComplaints(data.complaints || []);
    setLoadingData(false);
  };

  const fetchWorkers = async () => {
    const res = await fetch('/api/workers');
    if (res.ok) { const d = await res.json(); setWorkers(d.workers || []); }
  };

  useEffect(() => { if (user) fetchComplaints(); }, [filterWard, filterStatus, filterPriority]);

  const updateStatus = async (id: string, status: string, team?: string) => {
    await fetch(`/api/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assigned_team: team }),
    });
    fetchComplaints();
    fetchAnalytics();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!user) return null;

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'complaints', label: 'Complaints' },
    { key: 'routes', label: 'Routes' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'copilot', label: 'AI Copilot' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-slate-900 text-sm">Municipal Command Center</h1>
            <p className="text-xs text-slate-500">Ahmedabad Municipal Corporation · SWACHHAI AI</p>
          </div>
          <div className="flex gap-1 flex-wrap">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === t.key ? 'bg-green-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <KpiCard label="Total Complaints" value={analytics.total_complaints} color="blue" />
              <KpiCard label="Pending" value={analytics.pending} color="orange" />
              <KpiCard label="Resolved Today" value={analytics.resolved_today} color="green" />
              <KpiCard label="High Priority" value={analytics.high_priority} color="red" sub="Needs immediate action" />
              <KpiCard label="Collection Efficiency" value={`${analytics.collection_efficiency}%`} color="green" />
              <KpiCard label="Segregation Rate" value={`${analytics.segregation_rate}%`} color="purple" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">7-Day Complaint Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analytics.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="complaints" stroke="#ef4444" name="New" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="resolved" stroke="#16a34a" name="Resolved" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Ward Comparison</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={(analytics.ward_stats || []).slice(0, 6)} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="ward" type="category" tick={{ fontSize: 9 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="pending" fill="#ef4444" name="Pending" radius={2} />
                    <Bar dataKey="resolved" fill="#16a34a" name="Resolved" radius={2} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Map */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Live Complaint Map</h3>
              <MapView complaints={complaints} />
            </Card>

            {/* Ward Performance Table */}
            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Ward Performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Ward', 'Total', 'Resolved', 'Pending', 'High Priority', 'Segregation %', 'Resolution %'].map((h) => (
                        <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.ward_stats || []).map((w: any) => (
                      <tr key={w.ward} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs font-medium text-gray-900">{w.ward}</td>
                        <td className="px-4 py-2 text-xs text-gray-600">{w.total}</td>
                        <td className="px-4 py-2 text-xs text-green-600">{w.resolved}</td>
                        <td className="px-4 py-2 text-xs">
                          <span className={`font-semibold ${w.pending > 3 ? 'text-red-600' : 'text-gray-600'}`}>{w.pending}</span>
                        </td>
                        <td className="px-4 py-2 text-xs">
                          {w.high_priority > 0 && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">{w.high_priority}</span>}
                        </td>
                        <td className="px-4 py-2 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.round(w.segregation_rate * 100)}%` }} />
                            </div>
                            <span>{Math.round(w.segregation_rate * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs">
                          <span className={w.resolution_rate > 0.7 ? 'text-green-600' : w.resolution_rate > 0.4 ? 'text-orange-500' : 'text-red-500'}>
                            {Math.round(w.resolution_rate * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ── COMPLAINTS ── */}
        {tab === 'complaints' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-wrap gap-3">
                <select value={filterWard} onChange={(e) => setFilterWard(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">All Wards</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((w) => <option key={w} value={`Ward ${w}`}>Ward {w}</option>)}
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">All Statuses</option>
                  {['submitted','ai_processing','classified','assigned','in_progress','resolved','escalated'].map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>
                  ))}
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">All Priorities</option>
                  {['critical','high','medium','low'].map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
                </select>
                <button onClick={fetchComplaints} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                  Refresh
                </button>
              </div>
            </Card>

            {loadingData ? (
              <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Ticket', 'Category', 'Ward', 'Priority', 'Status', 'Assigned Team', 'Age', 'Actions'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.ticket_id}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs font-medium text-gray-900">{c.category}</div>
                            <div className="text-xs text-gray-400">{c.subcategory}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 max-w-[120px] truncate">{c.ward || '—'}</td>
                          <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                          <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px] truncate">{c.assigned_team || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(c.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap">
                              {c.status !== 'in_progress' && c.status !== 'resolved' && (
                                <button onClick={() => updateStatus(c.id, 'in_progress')}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md hover:bg-blue-200 transition whitespace-nowrap">
                                  → In Progress
                                </button>
                              )}
                              {c.status !== 'resolved' && (
                                <button onClick={() => updateStatus(c.id, 'resolved')}
                                  className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md hover:bg-green-200 transition">
                                  ✓ Resolve
                                </button>
                              )}
                              {c.status !== 'escalated' && c.priority !== 'low' && (
                                <button onClick={() => updateStatus(c.id, 'escalated')}
                                  className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-md hover:bg-red-200 transition">
                                  ↑ Escalate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {complaints.length === 0 && <EmptyState message="No complaints match your filters" />}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ── ROUTES ── */}
        {tab === 'routes' && <RouteOptimizer />}

        {/* ── ANALYTICS ── */}
        {tab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(analytics.ward_stats || []).map((w: any) => (
                <Card key={w.ward} className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">{w.ward}</h3>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div><p className="text-2xl font-bold text-gray-900">{w.total}</p><p className="text-gray-400">Total</p></div>
                    <div><p className="text-2xl font-bold text-green-600">{w.resolved}</p><p className="text-gray-400">Resolved</p></div>
                    <div><p className={`text-2xl font-bold ${w.pending > 3 ? 'text-red-500' : 'text-orange-500'}`}>{w.pending}</p><p className="text-gray-400">Pending</p></div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Segregation</span><span>{Math.round(w.segregation_rate * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.round(w.segregation_rate * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Resolution</span><span>{Math.round(w.resolution_rate * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.round(w.resolution_rate * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── AI COPILOT ── */}
        {tab === 'copilot' && <MunicipalCopilot />}
      </div>
    </div>
  );
}

// ── Route Optimizer ──────────────────────────────────────────────────────
function RouteOptimizer() {
  const [ward, setWard] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/routes').then((r) => r.json()).then((d) => setRoutes(d.routes || []));
  }, []);

  const optimize = async () => {
    setLoading(true);
    const res = await fetch('/api/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ward, team: 'Collection Team Alpha', vehicle: 'Sanitation Vehicle SV-04' }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
    fetch('/api/routes').then((r) => r.json()).then((d) => setRoutes(d.routes || []));
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Generate Optimized Route</h3>
        <div className="flex gap-3 items-end flex-wrap">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Ward</label>
            <select value={ward} onChange={(e) => setWard(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">All Active Complaints</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((w) => <option key={w} value={`Ward ${w}`}>Ward {w}</option>)}
            </select>
          </div>
          <button onClick={optimize} disabled={loading}
            className="bg-green-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition flex items-center gap-2">
            {loading ? <Spinner size="sm" /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            )}
            {loading ? 'Optimizing…' : "Optimize Today's Route"}
          </button>
        </div>
      </Card>

      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700">Original Route</h4>
              <span className="text-xs text-gray-400">{result.original_distance} km · {result.original_time} min</span>
            </div>
            <div className="space-y-1">
              {(result.original_stops || []).map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${s.type === 'depot' ? 'bg-gray-600' : s.type === 'transfer' ? 'bg-purple-600' : s.priority === 'critical' ? 'bg-red-500' : s.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`}>{i + 1}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{s.label}</p>
                    <p className="text-gray-400">{s.address}</p>
                  </div>
                  {s.priority && <PriorityBadge priority={s.priority} />}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 border-2 border-green-300">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-green-800">AI Optimized Route</h4>
                <AIBadge is_demo={result.is_demo} />
              </div>
              <span className="text-xs text-green-600 font-semibold">{result.optimized_distance} km · {result.optimized_time} min</span>
            </div>
            {result.improvement_pct > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-2 mb-3 text-xs text-green-700 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {result.improvement_pct}% improvement over current route
              </div>
            )}
            <div className="space-y-1">
              {(result.optimized_stops || []).map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${s.type === 'depot' ? 'bg-gray-600' : s.type === 'transfer' ? 'bg-purple-600' : s.priority === 'critical' ? 'bg-red-500' : s.priority === 'high' ? 'bg-orange-500' : 'bg-green-500'}`}>{i + 1}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{s.label}</p>
                    <p className="text-gray-400">{s.address}</p>
                  </div>
                  {s.priority && <PriorityBadge priority={s.priority} />}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-green-200 text-xs text-slate-500 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {result.vehicle} &nbsp;·&nbsp; {result.team}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Municipal AI Copilot ──────────────────────────────────────────────────
function MunicipalCopilot() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Good morning, Officer! I\'m your SWACHHAI AI Municipal Copilot. I can analyze complaint data, suggest actions, and help you plan today\'s operations. What would you like to know?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const QUICK = [
    'Which wards need immediate attention?',
    'Why are complaints increasing in Ward 12?',
    'Generate today\'s collection plan',
    'Which routes can be optimized?',
    'Show unresolved high-priority complaints',
    'Which ward has lowest segregation compliance?',
  ];

  const send = async (text?: string) => {
    const q = text || input;
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
    });
    const data = await res.json();
    setLoading(false);
    setMessages((m) => [...m, { role: 'ai', text: data.insight || 'Unable to process request.' }]);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="font-bold text-slate-900">AI Municipal Copilot</h2>
          <p className="text-xs text-slate-500">Powered by IBM Granite · Answers use real complaint data</p>
        </div>
      </div>

      <Card className="p-4 mb-4">
        <div className="h-80 overflow-y-auto space-y-3 mb-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-2">
                <Spinner size="sm" />
                <span className="text-xs text-gray-500">Analyzing city data…</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
          {QUICK.map((q) => (
            <button key={q} onClick={() => send(q)}
              className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full hover:bg-blue-100 transition">
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask about ward performance, priorities, or recommendations…"
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button onClick={() => send()} disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition text-sm font-semibold">
            Ask
          </button>
        </div>
      </Card>
    </div>
  );
}
