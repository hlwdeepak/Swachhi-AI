'use client';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

const AGENTS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    name: 'Grievance Intake',
    desc: 'Understands complaints in Gujarati, Hindi, and English using IBM Granite NLP.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    name: 'Route Optimization',
    desc: 'Generates AI-optimized collection routes based on complaint locations and priority.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    name: 'Municipal Routing',
    desc: 'Automatically routes complaints to the correct department with explainable AI logic.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    name: 'Segregation Compliance',
    desc: 'Classifies waste types and provides real-time disposal guidance.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    name: 'Ward Analytics',
    desc: 'Natural-language insights on ward performance, hotspots, and improvement trends.',
  },
];

const STEPS = [
  { num: '01', title: 'Citizen Reports', desc: 'Submit a complaint in Gujarati, Hindi, or English — by voice, text, or description.' },
  { num: '02', title: 'AI Understands', desc: 'IBM Granite classifies, prioritizes, and extracts location from the complaint.' },
  { num: '03', title: 'Routes to Team', desc: 'Municipal Routing Agent assigns the right department and field team instantly.' },
  { num: '04', title: 'Team Responds', desc: 'Field worker receives the task, navigates to location, and marks it resolved.' },
  { num: '05', title: 'Citizen Notified', desc: 'Real-time status updates keep the citizen informed throughout.' },
  { num: '06', title: 'Analytics Update', desc: 'Ward analytics reflect the resolution, improving future planning.' },
];

const IMPACT = [
  { metric: '40%', label: 'Faster Resolution', desc: 'AI triage cuts processing time drastically' },
  { metric: '25%', label: 'Route Efficiency', desc: 'Optimized collection routes save fuel and time' },
  { metric: '3×', label: 'Segregation Rate', desc: 'Citizen compliance through guided AI feedback' },
  { metric: '12', label: 'Ward Dashboards', desc: 'Live analytics for every ward in Ahmedabad' },
];

const TECH = ['IBM Granite LLM', 'IBM watsonx.ai', 'IBM Cloud', 'Next.js 14', 'TypeScript', 'SQLite', 'Leaflet Maps', 'Recharts'];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop"
            alt="Clean city streets"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-green-950/60" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-wide uppercase animate-hero">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Gujarat Hackathon 2026 — Challenge 18
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-4xl animate-hero delay-150">
            Smarter Cities.<br />
            <span className="text-green-400">Cleaner Gujarat.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed animate-hero delay-300">
            SWACHHAI AI uses Agentic AI to connect citizens, sanitation teams, and municipalities
            for faster, smarter waste management — powered by IBM Granite.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10 animate-hero delay-400">
            <Link href="/dashboard/citizen"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/25">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Report a Waste Issue
            </Link>
            <Link href="/dashboard/officer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Municipal Dashboard
            </Link>
          </div>

          {/* Demo accounts */}
          <div className="mt-10 p-4 bg-white/5 border border-white/10 rounded-2xl max-w-sm animate-hero delay-500">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">Demo Accounts — Password: Demo@123</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { role: 'Citizen', email: 'citizen@demo.com' },
                { role: 'Officer', email: 'officer@demo.com' },
                { role: 'Worker',  email: 'worker@demo.com' },
              ].map((d) => (
                <div key={d.role} className="text-center">
                  <p className="text-xs font-semibold text-white">{d.role}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 break-all">{d.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW STRIP ──────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-200 py-5 px-4 overflow-x-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 flex-nowrap min-w-max mx-auto">
            {['Citizen Reports', 'AI Classifies', 'Routes to Dept', 'Field Action', 'Resolved', 'Analytics Updated'].map((s, i, arr) => (
              <div key={s} className="flex items-center gap-2">
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm whitespace-nowrap">
                  {s}
                </div>
                {i < arr.length - 1 && (
                  <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map((s) => (
              <div key={s.num} className="group border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition-all duration-200">
                <div className="text-3xl font-black text-slate-100 group-hover:text-green-100 transition-colors mb-4 leading-none">{s.num}</div>
                <h3 className="font-semibold text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI AGENTS ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Powered By</p>
            <h2 className="text-3xl font-bold text-slate-900">AI Agents</h2>
            <p className="text-sm text-slate-500 mt-2">IBM Granite · IBM watsonx.ai · IBM Cloud</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENTS.map((a) => (
              <div key={a.name}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-green-300 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                  {a.icon}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{a.name} Agent</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-700 to-emerald-800 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-green-200 uppercase tracking-widest mb-2">Results</p>
            <h2 className="text-3xl font-bold">Expected Impact</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {IMPACT.map((i) => (
              <div key={i.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-white mb-1">{i.metric}</div>
                <p className="text-sm font-semibold text-green-100">{i.label}</p>
                <p className="text-xs text-green-300 mt-1 leading-snug">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITY IMAGE DIVIDER ───────────────────────────────────────── */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=1600&q=80&auto=format&fit=crop"
          alt="Ahmedabad city"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      {/* ── TECH STACK ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Built With</p>
          <div className="flex flex-wrap justify-center gap-2">
            {TECH.map((t) => (
              <span key={t}
                className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:border-green-300 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-950 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Ready to see it in action?</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Log in with the demo accounts to experience the full citizen → AI → municipal → field worker workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login"
              className="bg-green-500 hover:bg-green-400 active:scale-95 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/25">
              Login to Demo
            </Link>
            <Link href="/register"
              className="bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-400 mb-1">SWACHHAI AI</p>
        <p>Built for Gujarat Hackathon 2026 — Challenge 18: Municipal Solid Waste & Circular Economy</p>
        <p className="mt-1">Powered by IBM Granite · IBM watsonx.ai · IBM Cloud</p>
      </footer>
    </div>
  );
}
