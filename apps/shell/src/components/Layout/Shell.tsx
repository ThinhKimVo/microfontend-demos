import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ShellProps {
  children: React.ReactNode;
}

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function Shell({ children }: ShellProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {!isHome && (
                <Link
                  to="/"
                  className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Back to home"
                >
                  <BackIcon />
                </Link>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MF</span>
                </div>
                <span className="font-semibold text-slate-900">Microfrontend Demo</span>
              </div>
            </div>
            {isHome && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="w-2 h-2 bg-green-400 rounded-full motion-safe:animate-pulse" aria-hidden="true"></span>
                <span>All services running</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
