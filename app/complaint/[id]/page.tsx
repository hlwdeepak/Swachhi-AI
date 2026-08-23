'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Card, PriorityBadge, StatusBadge, Spinner, AIBadge } from '@/components/ui';
import { timeAgo, statusLabel } from '@/lib/utils';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  submitted: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  ai_processing: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  classified: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  assigned: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  in_progress: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  resolved: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  escalated: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-600',
  ai_processing: 'bg-purple-100 text-purple-600',
  classified: 'bg-indigo-100 text-indigo-600',
  assigned: 'bg-cyan-100 text-cyan-600',
  in_progress: 'bg-orange-100 text-orange-600',
  resolved: 'bg-green-100 text-green-600',
  escalated: 'bg-red-100 text-red-600',
};

export default function ComplaintDetailPage() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/complaints/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!data?.complaint) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-slate-400">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm font-medium">Complaint not found</p>
    </div>
  );

  const c = data.complaint;
  const timeline = data.timeline || [];

  let aiData: any = null;
  try { aiData = c.ai_classification ? JSON.parse(c.ai_classification) : null; } catch { /* ignore */ }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Link href="/dashboard/citizen"
          className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <Card className="p-5">
          <div className="flex justify-between items-start gap-3 mb-4">
            <div>
              <p className="text-xs font-mono text-slate-400">{c.ticket_id}</p>
              <h1 className="text-lg font-bold text-slate-900 mt-0.5">{c.category}</h1>
              <p className="text-sm text-slate-500">{c.subcategory}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={c.status} />
              <PriorityBadge priority={c.priority} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            {c.ward && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {c.ward}{c.address ? ` · ${c.address}` : ''}
              </span>
            )}
            {c.assigned_team && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {c.assigned_team}
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeAgo(c.created_at)}
            </span>
          </div>
        </Card>

        {/* Complaint text */}
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your Complaint</h3>
          <p className="text-sm text-slate-800 leading-relaxed">{c.description}</p>
          {c.translated_description && c.translated_description !== c.description && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-1">English translation:</p>
              <p className="text-xs text-slate-600 leading-relaxed">{c.translated_description}</p>
            </div>
          )}
        </Card>

        {/* AI Analysis */}
        {aiData && (
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">AI Classification</h3>
              <AIBadge is_demo={aiData.is_demo} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              {[
                { label: 'Language', value: aiData.language_name || c.original_language },
                { label: 'Category', value: c.category },
                { label: 'Sub-category', value: c.subcategory },
                { label: 'Priority', value: c.priority, capitalize: true },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-slate-400 text-xs mb-0.5">{item.label}</p>
                  <p className={`font-semibold text-slate-900 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                </div>
              ))}
            </div>
            {c.priority_reason && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
                <p className="font-semibold mb-1">Why {c.priority} priority?</p>
                <p className="leading-relaxed">{c.priority_reason}</p>
              </div>
            )}
          </Card>
        )}

        {/* Routing explanation */}
        {c.ai_routing_explanation && (
          <Card className="p-4 border-l-4 border-l-green-500">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Assignment Reason</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{c.ai_routing_explanation}</p>
          </Card>
        )}

        {/* Timeline */}
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-5">Complaint Timeline</h3>
          <div className="relative">
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-5">
              {timeline.map((t: any) => (
                <div key={t.id} className="relative flex gap-4 items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${STATUS_COLORS[t.status] || 'bg-slate-100 text-slate-500'}`}>
                    {STATUS_ICONS[t.status] || (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 pt-1 pb-1">
                    <p className="text-xs font-semibold text-slate-900">{statusLabel(t.status)}</p>
                    {t.note && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.note}</p>}
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(t.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
