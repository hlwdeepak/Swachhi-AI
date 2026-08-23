'use client';
import { priorityColor, statusColor, statusLabel } from '@/lib/utils';

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${priorityColor(priority)}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const live = ['submitted', 'ai_processing', 'in_progress'].includes(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(status)}`}>
      {live && <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />}
      {statusLabel(status)}
    </span>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
  return (
    <div className={`${s} border-2 border-green-200 border-t-green-600 rounded-full animate-spin`} />
  );
}

export function AIBadge({ is_demo }: { is_demo?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${is_demo ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 101.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 013.095 2.348.75.75 0 00.992 0 26.547 26.547 0 015.93-3.95.75.75 0 00.42-.739 41.053 41.053 0 00-.39-3.114 29.925 29.925 0 00-5.199 2.801 2.25 2.25 0 01-2.514 0c-.41-.275-.826-.541-1.25-.797zM8.25 9.755a.75.75 0 011.5 0v.008a.75.75 0 01-1.5 0V9.755z" clipRule="evenodd" />
      </svg>
      {is_demo ? 'Demo AI' : 'IBM Granite'}
    </span>
  );
}

export function KpiCard({
  label, value, sub, color = 'green'
}: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  const accents: Record<string, { border: string; bg: string; text: string }> = {
    green:  { border: 'border-l-green-500',  bg: 'bg-green-50',  text: 'text-green-600'  },
    red:    { border: 'border-l-red-500',    bg: 'bg-red-50',    text: 'text-red-600'    },
    orange: { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' },
    blue:   { border: 'border-l-blue-500',   bg: 'bg-blue-50',   text: 'text-blue-600'   },
    purple: { border: 'border-l-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    gray:   { border: 'border-l-slate-400',  bg: 'bg-slate-50',  text: 'text-slate-600'  },
  };
  const a = accents[color] || accents.green;
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${a.border} p-4 shadow-sm`}>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide leading-none">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-2 leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
        {icon || (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

// Section header component
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
