import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { JWTPayload, Role } from './types';

export function getAuthUser(req: NextRequest): JWTPayload | null {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/swachhai_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest, allowedRoles?: Role[]): JWTPayload | null {
  const user = getAuthUser(req);
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  return user;
}

export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `SW-${year}-${random}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'text-red-700 bg-red-100';
    case 'high': return 'text-orange-700 bg-orange-100';
    case 'medium': return 'text-yellow-700 bg-yellow-100';
    case 'low': return 'text-green-700 bg-green-100';
    default: return 'text-gray-700 bg-gray-100';
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'submitted': return 'text-blue-700 bg-blue-100';
    case 'ai_processing': return 'text-purple-700 bg-purple-100';
    case 'classified': return 'text-indigo-700 bg-indigo-100';
    case 'assigned': return 'text-cyan-700 bg-cyan-100';
    case 'in_progress': return 'text-orange-700 bg-orange-100';
    case 'resolved': return 'text-green-700 bg-green-100';
    case 'escalated': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    submitted: 'Submitted',
    ai_processing: 'AI Processing',
    classified: 'Classified',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    escalated: 'Escalated',
  };
  return map[status] || status;
}
