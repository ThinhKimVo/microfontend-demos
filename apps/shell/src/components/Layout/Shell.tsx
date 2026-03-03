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
    <div className="min-h-screen">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              {!isHome && (
                <Link
                  to="/"
                  className="group p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-300"
                  aria-label="Back to home"
                >
                  <BackIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </Link>
              )}
              <Link to="/" className="flex items-center group">
                <img
                  src="/logo-black.svg"
                  alt="Saigon Technology"
                  className="h-8 w-auto brightness-0 invert group-hover:drop-shadow-[0_0_8px_rgba(132,175,72,0.5)] transition-all duration-300"
                />
              </Link>
            </div>

            <nav className="flex items-center gap-8">
              {isHome && (
                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                    all systems nominal
                  </span>
                </div>
              )}

              {isAuthenticated ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 group px-1 py-1 pr-4 rounded-full bg-white/5 border border-white/10 hover:border-accent-cyan/30 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold tracking-tight text-slate-300 group-hover:text-accent-cyan transition-colors">
                    {user?.name}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300 hover:border-accent-cyan hover:text-accent-cyan transition-all duration-300"
                >
                  Terminate Guest
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {children}
      </main>

      {/* Aesthetic Footer Decor */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-700">
          <p className="font-mono text-[10px] tracking-widest uppercase">
            &copy; 2026 SAIGON TECHNOLOGY // [CORE_UNIT_BETA]
          </p>
          <div className="flex gap-8 font-mono text-[10px] tracking-widest uppercase">
            <span className="hover:text-accent-cyan cursor-pointer">Security Protocol</span>
            <span className="hover:text-accent-cyan cursor-pointer">Network Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
