'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Card, PriorityBadge, StatusBadge, Spinner, AIBadge, EmptyState } from '@/components/ui';
import { timeAgo } from '@/lib/utils';

const DEMO_COMPLAINT = 'અમારા વિસ્તારમાં ત્રણ દિવસથી કચરો ઉપાડવા કોઈ આવ્યું નથી.';

type Tab = 'home' | 'report' | 'complaints' | 'assistant' | 'segregation';

const NAV_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'home', label: 'Home',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    key: 'report', label: 'Report',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    key: 'complaints', label: 'My Complaints',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    key: 'segregation', label: 'Segregation',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  },
  {
    key: 'assistant', label: 'AI Assistant',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  },
];

export default function CitizenDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('home');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    const res = await fetch('/api/complaints?limit=20');
    const data = await res.json();
    setComplaints(data.complaints || []);
    setLoadingComplaints(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">

        {/* ── HOME ── */}
        {tab === 'home' && (
          <div className="space-y-4">
            {/* Hero card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 p-5 text-white shadow-lg">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
              <div className="relative">
                <p className="text-green-200 text-xs font-medium mb-1">Welcome back</p>
                <h1 className="text-xl font-bold">{user.name}</h1>
                {user.ward && (
                  <p className="text-green-200 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.ward}
                  </p>
                )}
                <p className="text-green-100 text-sm mt-3">How can we help today?</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Voice Report', tab: 'report' as Tab,
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
                  color: 'text-green-600 bg-green-50 border-green-200',
                },
                {
                  label: 'Report Issue', tab: 'report' as Tab,
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                  color: 'text-blue-600 bg-blue-50 border-blue-200',
                },
                {
                  label: 'Waste Guide', tab: 'segregation' as Tab,
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
                  color: 'text-purple-600 bg-purple-50 border-purple-200',
                },
              ].map((q) => (
                <button key={q.label} onClick={() => setTab(q.tab)}
                  className={`border rounded-2xl p-4 text-center hover:shadow-sm transition-all active:scale-95 ${q.color}`}>
                  <div className="flex justify-center mb-2">{q.icon}</div>
                  <p className="text-xs font-semibold">{q.label}</p>
                </button>
              ))}
            </div>

            {/* Recent complaints */}
            <Card className="overflow-hidden">
              <div className="px-4 pt-4 pb-3 flex justify-between items-center border-b border-slate-100">
                <h2 className="font-semibold text-slate-900 text-sm">Recent Complaints</h2>
                <button onClick={() => setTab('complaints')}
                  className="text-xs text-green-600 font-medium hover:underline">View all</button>
              </div>
              {loadingComplaints ? (
                <div className="p-6 flex justify-center"><Spinner /></div>
              ) : complaints.length === 0 ? (
                <EmptyState message="No complaints submitted yet" />
              ) : (
                complaints.slice(0, 3).map((c) => (
                  <Link key={c.id} href={`/complaint/${c.id}`}>
                    <div className="px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-slate-400">{c.ticket_id}</p>
                          <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{c.category}</p>
                          <p className="text-xs text-slate-500 truncate">{c.subcategory}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StatusBadge status={c.status} />
                          <PriorityBadge priority={c.priority} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </Card>

            {/* Waste segregation guide */}
            <Card className="p-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Waste Segregation Guide</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Green Bin', desc: 'Wet / Organic waste', cls: 'bg-green-50 border border-green-200 text-green-800', dot: 'bg-green-500' },
                  { label: 'Blue Bin', desc: 'Dry / Recyclable', cls: 'bg-blue-50 border border-blue-200 text-blue-800', dot: 'bg-blue-500' },
                  { label: 'Red Bin', desc: 'Hazardous waste', cls: 'bg-red-50 border border-red-200 text-red-800', dot: 'bg-red-500' },
                  { label: 'Black Bin', desc: 'Non-recyclable', cls: 'bg-slate-100 border border-slate-200 text-slate-700', dot: 'bg-slate-500' },
                ].map((b) => (
                  <div key={b.label} className={`${b.cls} rounded-xl p-3`}>
                    <div className={`w-3 h-3 rounded-full ${b.dot} mb-2`} />
                    <p className="text-xs font-semibold">{b.label}</p>
                    <p className="text-xs opacity-80 mt-0.5">{b.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── REPORT ── */}
        {tab === 'report' && (
          <ReportComplaint onSuccess={() => { fetchComplaints(); setTab('complaints'); }} />
        )}

        {/* ── COMPLAINTS ── */}
        {tab === 'complaints' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-1">
              <h2 className="font-bold text-slate-900">My Complaints</h2>
              <button onClick={fetchComplaints}
                className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100 transition-colors">
                Refresh
              </button>
            </div>
            {loadingComplaints ? (
              <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : complaints.length === 0 ? (
              <EmptyState message="No complaints submitted yet" />
            ) : (
              complaints.map((c) => (
                <Link key={c.id} href={`/complaint/${c.id}`}>
                  <Card className="p-4 hover:border-green-300 transition-colors card-hover mb-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-slate-400">{c.ticket_id}</p>
                        <p className="font-semibold text-slate-900 mt-0.5">{c.category}</p>
                        <p className="text-xs text-slate-500">{c.subcategory}</p>
                        {c.ward && (
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {c.ward}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(c.created_at)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <StatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                    </div>
                    {c.assigned_team && (
                      <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {c.assigned_team}
                      </p>
                    )}
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* ── SEGREGATION ── */}
        {tab === 'segregation' && <SegregationChecker />}

        {/* ── ASSISTANT ── */}
        {tab === 'assistant' && <WasteAssistant />}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 shadow-[0_-1px_0_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex">
          {NAV_ITEMS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-xs transition-colors ${tab === t.key ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}>
              <span className={`transition-transform ${tab === t.key ? 'scale-110' : ''}`}>{t.icon}</span>
              <span className={`text-xs ${tab === t.key ? 'font-semibold' : ''}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ── Report Complaint ─────────────────────────────────────────────────────────
function ReportComplaint({ onSuccess }: { onSuccess: () => void }) {
  const [text, setText] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [classification, setClassification] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'submitted'>('input');
  const [result, setResult] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  const inputCls = 'w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition';

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setError('Voice not supported in this browser. Use Chrome.'); return; }
    const rec = new SpeechRecognition();
    rec.lang = 'gu-IN';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
    };
    rec.onend = () => { setRecording(false); if (transcript) setText(transcript); };
    rec.start();
    setRecording(true);
    recognitionRef.current = rec;
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setRecording(false);
    if (transcript) setText(transcript);
  };

  const classifyText = async () => {
    if (!text.trim()) { setError('Please enter a description'); return; }
    setClassifying(true);
    setError('');
    const res = await fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setClassification(data.result);
    setClassifying(false);
    setStep('confirm');
  };

  const submitComplaint = async () => {
    setSubmitting(true);
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: text, ward: classification?.ward || ward, address }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error || 'Submission failed'); return; }
    setResult(data);
    setStep('submitted');
  };

  if (step === 'submitted' && result) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-bold text-green-900 text-lg">Complaint Submitted!</h2>
          <p className="text-sm text-green-700 mt-2">Ticket: <span className="font-mono font-bold">{result.complaint?.ticket_id}</span></p>
          <p className="text-xs text-green-600 mt-1">Assigned to: {result.routing?.team}</p>
        </div>
        <Card className="p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">AI Classification</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200">{result.classification?.category}</span>
            <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full border border-orange-200 capitalize">{result.classification?.priority} Priority</span>
            <AIBadge is_demo={result.classification?.is_demo} />
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{result.routing?.explanation}</p>
        </Card>
        <button onClick={() => { setText(''); setClassification(null); setTranscript(''); setStep('input'); onSuccess(); }}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm">
          View My Complaints
        </button>
      </div>
    );
  }

  if (step === 'confirm' && classification) {
    return (
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">Confirm Complaint</h2>
        <Card className="p-4 space-y-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Your complaint:</p>
            <p className="text-sm text-slate-800">{text}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Language', value: classification.language_name },
              { label: 'Category', value: classification.category },
              { label: 'Issue', value: classification.subcategory },
              { label: 'Priority', value: classification.priority, capitalize: true },
              ...(classification.ward ? [{ label: 'Ward', value: classification.ward }] : []),
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className={`font-semibold text-slate-900 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
            <p className="font-semibold mb-1">Why {classification.priority} priority?</p>
            <p className="leading-relaxed">{classification.priority_reason}</p>
          </div>
          <AIBadge is_demo={classification.is_demo} />
        </Card>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex gap-3">
          <button onClick={() => setStep('input')}
            className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition">
            Edit
          </button>
          <button onClick={submitComplaint} disabled={submitting}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition flex items-center justify-center gap-2">
            {submitting && <Spinner size="sm" />}
            {submitting ? 'Submitting…' : 'Submit Complaint'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-slate-900 text-lg">Report a Waste Issue</h2>

      {/* Voice button */}
      <Card className="p-5 text-center">
        <button
          onClick={recording ? stopVoice : startVoice}
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white transition-all ${recording ? 'bg-red-500 recording' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'}`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <p className="text-sm font-semibold mt-3 text-slate-700">
          {recording ? 'Listening… tap to stop' : 'Tap to speak your complaint'}
        </p>
        <p className="text-xs text-slate-400 mt-1">Supports Gujarati, Hindi, English</p>
        {transcript && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 text-left">
            <span className="font-semibold">Transcript: </span>{transcript}
          </div>
        )}
      </Card>

      {/* Demo prefill */}
      <button onClick={() => setText(DEMO_COMPLAINT)}
        className="w-full text-xs text-center text-amber-700 bg-amber-50 border border-amber-100 py-2.5 rounded-xl hover:bg-amber-100 transition font-medium">
        Use Demo Gujarati Complaint
      </button>

      {/* Text input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Describe the Issue</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
          placeholder="Describe your complaint in any language…"
          className={`${inputCls} resize-none`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ward</label>
          <input value={ward} onChange={(e) => setWard(e.target.value)} placeholder="e.g. Ward 12"
            className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street / Area"
            className={inputCls} />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      <button onClick={classifyText} disabled={classifying || !text.trim()}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-sm">
        {classifying && <Spinner size="sm" />}
        {classifying ? 'Analyzing with AI…' : 'Analyze & Continue'}
        {!classifying && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ── Segregation Checker ──────────────────────────────────────────────────────
function SegregationChecker() {
  const [hint, setHint] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const res = await fetch('/api/ai/segregation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hint }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  const colorMap: Record<string, string> = {
    green: 'border-green-300 bg-green-50 text-green-800',
    blue: 'border-blue-300 bg-blue-50 text-blue-800',
    red: 'border-red-300 bg-red-50 text-red-800',
    orange: 'border-orange-300 bg-orange-50 text-orange-800',
    gray: 'border-slate-300 bg-slate-50 text-slate-800',
    cyan: 'border-cyan-300 bg-cyan-50 text-cyan-800',
  };

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-slate-900 text-lg">Waste Segregation Check</h2>
      <Card className="p-4">
        <p className="text-xs text-slate-500 mb-3">Describe your waste item for AI classification</p>
        <input value={hint} onChange={(e) => setHint(e.target.value)}
          placeholder="e.g. plastic bottle, food scraps, battery…"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition mb-3" />
        <div className="flex gap-2 flex-wrap mb-3">
          {['food waste', 'plastic bottle', 'paper', 'battery', 'mixed garbage'].map((h) => (
            <button key={h} onClick={() => setHint(h)}
              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-green-100 hover:text-green-700 transition font-medium">
              {h}
            </button>
          ))}
        </div>
        <button onClick={analyze} disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition flex items-center justify-center gap-2">
          {loading ? <Spinner size="sm" /> : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {loading ? 'Classifying…' : 'Classify Waste'}
        </button>
      </Card>

      {result && (
        <div className={`border-2 rounded-2xl p-4 ${colorMap[result.color] || colorMap.gray}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-bold text-lg">{result.classification_label}</p>
              <p className="text-xs opacity-70 mt-0.5">Confidence: {Math.round(result.confidence * 100)}%</p>
            </div>
            <AIBadge is_demo={result.is_demo} />
          </div>
          <div className="bg-white/70 rounded-xl p-3 mb-3">
            <p className="text-xs font-semibold mb-1">Recommendation</p>
            <p className="text-sm leading-relaxed">{result.recommendation}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 mb-3">
            <p className="text-xs font-semibold mb-1">Disposal Method</p>
            <p className="text-xs leading-relaxed">{result.disposal_method}</p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2">Tips</p>
            <ul className="space-y-1.5">
              {result.segregation_tips?.map((t: string, i: number) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0 opacity-60" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Waste Assistant ──────────────────────────────────────────────────────────
function WasteAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I\'m your SWACHHAI AI assistant. Ask me about waste segregation, complaint status, or municipal guidelines.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const QUICK = ['Where do I throw plastic?', 'How to dispose medicine waste?', 'Collection schedule?', 'Segregation rules?'];

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
    setMessages((m) => [...m, { role: 'ai', text: data.insight || 'I could not process that request.' }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <h2 className="font-bold text-slate-900 text-lg mb-3">AI Waste Assistant</h2>
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Spinner size="sm" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
              <span className="text-xs text-slate-400">Thinking…</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 flex-wrap mb-2">
        {QUICK.map((q) => (
          <button key={q} onClick={() => send(q)}
            className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition font-medium">
            {q}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about waste management…"
          className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
        <button onClick={() => send()} disabled={loading}
          className="bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-60 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
