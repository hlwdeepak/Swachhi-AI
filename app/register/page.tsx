'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from '@/components/ui';

const inputCls = 'w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'citizen', language: 'en', ward: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'Registration failed'); return; }
    if (form.role === 'officer') router.push('/dashboard/officer');
    else if (form.role === 'worker') router.push('/dashboard/worker');
    else router.push('/dashboard/citizen');
  };

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const ROLES = [
    { val: 'citizen', label: 'Citizen', desc: 'Report waste issues',   icon: '👤' },
    { val: 'officer', label: 'Officer', desc: 'Manage municipal ward',  icon: '🏛️' },
    { val: 'worker',  label: 'Worker',  desc: 'Handle field tasks',     icon: '👷' },
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col">
        <img
          src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1000&q=85&auto=format&fit=crop"
          alt="Smart city"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-slate-900/85 to-slate-950/95" />
        <div className="absolute top-1/3 -right-10 w-52 h-52 rounded-full bg-emerald-500/10 animate-float" />
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
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Join the Smart<br /><span className="text-green-400">City Movement</span></h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Create your account and start reporting waste issues in Gujarati, Hindi, or English. Your complaint reaches the right team instantly.
            </p>
          </div>
          <p className="text-xs text-slate-600 animate-fade-in delay-400">Gujarat Hackathon 2026 — Challenge 18</p>
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden animate-fade-in">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="font-bold text-slate-900">SWACHHAI AI</span>
          </Link>

          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-sm text-slate-500 mb-7">Join the platform for smarter waste management</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-center gap-2 animate-scale-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in-up delay-75">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input required value={form.name} onChange={(e) => set('name', e.target.value)}
                className={inputCls} placeholder="Your full name" />
            </div>

            <div className="animate-fade-in-up delay-150">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                className={inputCls} placeholder="your@email.com" />
            </div>

            <div className="animate-fade-in-up delay-200">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input required type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className={`${inputCls} pr-10`} placeholder="Min 6 characters" minLength={6} />
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

            <div className="animate-fade-in-up delay-300">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)}
                className={inputCls} placeholder="10-digit mobile number" />
            </div>

            <div className="grid grid-cols-2 gap-3 animate-fade-in-up delay-300">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Language</label>
                <select value={form.language} onChange={(e) => set('language', e.target.value)} className={inputCls}>
                  <option value="en">English</option>
                  <option value="gu">Gujarati</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ward</label>
                <input value={form.ward} onChange={(e) => set('ward', e.target.value)}
                  className={inputCls} placeholder="e.g. Ward 12" />
              </div>
            </div>

            {/* Role selector */}
            <div className="animate-fade-in-up delay-400">
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button key={r.val} type="button" onClick={() => set('role', r.val)}
                    className={`border rounded-xl p-3 text-left transition-all duration-200 active:scale-95 ${
                      form.role === r.val
                        ? 'border-green-500 bg-green-50 shadow-sm shadow-green-100'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}>
                    <p className={`text-xs font-semibold ${form.role === r.val ? 'text-green-700' : 'text-slate-700'}`}>{r.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fade-in-up delay-500">
              <button type="submit" disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-green-200 group mt-1">
                {loading ? <Spinner size="sm" /> : (
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6 animate-fade-in delay-600">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 font-semibold hover:underline underline-offset-2 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
