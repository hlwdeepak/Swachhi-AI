'use client';
import { useAuth } from '@/lib/context';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []));
  }, [user]);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: 1 })));
  };

  const dashPath =
    user?.role === 'officer'
      ? '/dashboard/officer'
      : user?.role === 'worker'
      ? '/dashboard/worker'
      : '/dashboard/citizen';

  return (
    <nav className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-300 ${scrolled ? 'shadow-md border-b border-slate-200' : 'border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="leading-none">
            <span className="font-bold text-slate-900 text-sm tracking-tight">SWACHHAI</span>
            <span className="font-light text-slate-400 text-sm tracking-wider"> AI</span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <Link href={dashPath}
                className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-all duration-150 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Dashboard
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setShowNotif(!showNotif); if (!showNotif) markRead(); }}
                  className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors duration-150"
                  aria-label="Notifications"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce-once">
                      {unread}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-dropdown">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-900">Notifications</span>
                      <button onClick={() => setShowNotif(false)}
                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-200 transition-colors text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-slate-400">
                          <svg className="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <p className="text-xs font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`px-4 py-3 transition-colors ${!n.read ? 'bg-green-50/60' : 'hover:bg-slate-50'}`}>
                            <div className="flex gap-2.5">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-green-500' : 'bg-slate-300'}`} />
                              <div>
                                <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User + logout */}
              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-700 leading-none">{user.name.split(' ')[0]}</p>
                  <p className="text-xs text-slate-400 capitalize leading-none mt-0.5">{user.role}</p>
                </div>
                <button onClick={logout}
                  className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors duration-150 ml-1 px-2 py-1 rounded-md hover:bg-red-50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"
                className="text-sm text-slate-600 hover:text-green-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-150 font-medium">
                Login
              </Link>
              <Link href="/register"
                className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 font-semibold shadow-sm shadow-green-200">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
