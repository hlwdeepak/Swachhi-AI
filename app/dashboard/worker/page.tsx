'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, PriorityBadge, StatusBadge, Spinner, EmptyState } from '@/components/ui';
import { timeAgo } from '@/lib/utils';

export default function WorkerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && user.role === 'citizen') router.push('/dashboard/citizen');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    const allTasks = await fetch('/api/complaints?limit=30').then((r) => r.json());
    setTasks((allTasks.complaints || []).filter((c: any) =>
      ['assigned', 'in_progress', 'escalated'].includes(c.status)
    ));
    setLoadingTasks(false);
  };

  const startTask = async (id: string) => {
    await fetch(`/api/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'in_progress', note: 'Field worker started task' }),
    });
    fetchTasks();
  };

  const completeTask = async (id: string) => {
    setCompleting(id);
    await fetch(`/api/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved', note: notes[id] || 'Waste collected and area cleared' }),
    });
    setCompleting(null);
    fetchTasks();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!user) return null;

  const critical = tasks.filter((t) => t.priority === 'critical');
  const high = tasks.filter((t) => t.priority === 'high');
  const medium = tasks.filter((t) => t.priority === 'medium');
  const low = tasks.filter((t) => t.priority === 'low');

  const taskGroups = [
    { label: 'Critical', tasks: critical, color: 'border-l-red-500', badge: 'bg-red-100 text-red-700' },
    { label: 'High Priority', tasks: high, color: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-700' },
    { label: 'Medium', tasks: medium, color: 'border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-700' },
    { label: 'Low', tasks: low, color: 'border-l-green-500', badge: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white mb-4 shadow-lg">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
          <div className="relative">
            <p className="text-slate-400 text-xs font-medium mb-1">Field Worker</p>
            <h1 className="text-xl font-bold">{user.name}</h1>
            {user.ward && (
              <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {user.ward}
              </p>
            )}
            <div className="flex items-center gap-3 mt-4">
              <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[70px]">
                <p className="text-2xl font-bold">{tasks.length}</p>
                <p className="text-slate-400 text-xs mt-0.5">Active Tasks</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[70px]">
                <p className="text-2xl font-bold text-red-400">{critical.length + high.length}</p>
                <p className="text-slate-400 text-xs mt-0.5">High Priority</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[70px]">
                <p className="text-2xl font-bold text-green-400">{medium.length + low.length}</p>
                <p className="text-slate-400 text-xs mt-0.5">Normal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-900">Today&apos;s Tasks</h2>
          <button onClick={fetchTasks}
            className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {loadingTasks ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : tasks.length === 0 ? (
          <Card className="p-8">
            <EmptyState message="No active tasks assigned. Check back soon." />
          </Card>
        ) : (
          <div className="space-y-6">
            {taskGroups.filter((g) => g.tasks.length > 0).map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${group.badge}`}>{group.label}</span>
                  <span className="text-xs text-slate-400">{group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-3">
                  {group.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      borderClass={group.color}
                      note={notes[task.id] || ''}
                      onNoteChange={(n) => setNotes((prev) => ({ ...prev, [task.id]: n }))}
                      onStart={() => startTask(task.id)}
                      onComplete={() => completeTask(task.id)}
                      completing={completing === task.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: any;
  borderClass: string;
  note: string;
  onNoteChange: (n: string) => void;
  onStart: () => void;
  onComplete: () => void;
  completing: boolean;
}

function TaskCard({ task, borderClass, note, onNoteChange, onStart, onComplete, completing }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${borderClass} overflow-hidden shadow-sm`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-slate-400">{task.ticket_id}</p>
            <p className="font-semibold text-slate-900 mt-0.5">{task.category}</p>
            <p className="text-xs text-slate-500">{task.subcategory}</p>
            {task.ward && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {task.ward}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-400">{timeAgo(task.created_at)}</p>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
          {task.description && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-600 mb-1">Complaint</p>
              <p className="text-xs text-slate-700 leading-relaxed">{task.description}</p>
            </div>
          )}

          {task.latitude && task.longitude && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${task.latitude},${task.longitude}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-blue-700 hover:bg-blue-100 transition w-full font-medium"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Navigate to Location ({task.latitude.toFixed(4)}, {task.longitude.toFixed(4)})
            </a>
          )}

          {task.ai_routing_explanation && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">AI Assignment Reason</p>
              <p className="text-xs text-amber-600 leading-relaxed">{task.ai_routing_explanation}</p>
            </div>
          )}

          {task.assigned_team && (
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Assigned to: {task.assigned_team}
            </p>
          )}

          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Add completion notes (optional)…"
            rows={2}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
          />

          <div className="flex gap-2">
            {task.status === 'assigned' && (
              <button onClick={onStart}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Task
              </button>
            )}
            {task.status !== 'resolved' && (
              <button onClick={onComplete} disabled={completing}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition flex items-center justify-center gap-1.5">
                {completing ? <Spinner size="sm" /> : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                Mark Complete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
