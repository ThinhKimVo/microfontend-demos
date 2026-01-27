import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BackIcon } from '../Icons';
import { useAuth } from '../../contexts/AuthContext';

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              {!isHome && (
                <Link
                  to="/"
                  className="p-1.5 -ml-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Back to home"
                >
                  <BackIcon className="w-4 h-4" />
                </Link>
              )}
              <Link to="/" className="flex items-center">
                <img
                  src="/logo-black.svg"
                  alt="Saigon Technology"
                  className="h-7 w-auto"
                />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {isHome && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" aria-hidden="true" />
                  <span>All services running</span>
                </div>
              )}
              {isAuthenticated ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{user?.name}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-xs text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
