'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from '@/components/ui';

const DEMO = [
  { label: 'Citizen', email: 'citizen@demo.com', color: 'hover:border-green-400 hover:bg-green-50 hover:text-green-700' },
  { label: 'Officer', email: 'officer@demo.com', color: 'hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700' },
  { label: 'Worker',  email: 'worker@demo.com',  color: 'hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    const role = data.user?.role;
    if (role === 'officer') router.push('/dashboard/officer');
    else if (role === 'worker') router.push('/dashboard/worker');
    else router.push('/dashboard/citizen');
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — imagery ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=85&auto=format&fit=crop"
          alt="Clean city"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-slate-900/85 to-slate-950/95" />

        {/* Floating decorative blobs */}
        <div className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-green-500/10 animate-float-slow" />
        <div className="absolute bottom-1/4 -left-12 w-48 h-48 rounded-full bg-blue-500/10 animate-float" />

        <div className="relative flex flex-col justify-between h-full p-12 z-10">
          <Link href="/" className="flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="font-bold text-white text-xl tracking-tight">SWACHHAI AI</span>
          </Link>

          <div className="animate-fade-in-up delay-200">
            <h2 className="text-4xl font-bold text-white leading-tight mb-5">
              AI-Powered Waste<br />
              <span className="text-green-400">Management</span><br />
              for Gujarat
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-sm">
              Connecting citizens, sanitation teams, and municipalities through intelligent Agentic AI — powered by IBM Granite.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              {[
                { val: '40%', lbl: 'Faster resolution' },
                { val: '25%', lbl: 'Route efficiency' },
                { val: '3×',  lbl: 'Segregation rate' },
                { val: '12',  lbl: 'Ward dashboards' },
              ].map((s, i) => (
                <div key={s.lbl}
                  className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5 animate-fade-in-up delay-${300 + i * 75}`}>
                  <div className="text-2xl font-black text-green-400">{s.val}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-600 animate-fade-in delay-600">Gujarat Hackathon 2026 — Challenge 18</p>
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden animate-fade-in">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="font-bold text-slate-900">SWACHHAI AI</span>
          </Link>

          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500 mb-8">Sign in to your account to continue</p>
          </div>

          {/* Demo quick login */}
          <div className="mb-6 animate-fade-in-up delay-75">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Quick Demo — Password: Demo@123</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO.map((d) => (
                <button key={d.email}
                  onClick={() => { setEmail(d.email); setPassword('Demo@123'); }}
                  className={`border border-slate-200 text-slate-600 text-xs px-2 py-2.5 rounded-xl transition-all duration-200 font-medium active:scale-95 ${d.color}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5 animate-fade-in-up delay-150">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or sign in manually</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-center gap-2 animate-scale-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up delay-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required placeholder="your@email.com"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-10"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-10 pr-10"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-green-200 mt-2 group">
              {loading ? <Spinner size="sm" /> : (
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6 animate-fade-in delay-300">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-green-600 font-semibold hover:underline underline-offset-2 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
