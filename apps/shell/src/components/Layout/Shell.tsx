import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ShellProps {
  children: React.ReactNode;
}

// Framework Icons
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ReactIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96.77-.16 1.58-.28 2.4-.36.48-.67.99-1.31 1.51-1.9z" />
  </svg>
);

const VueIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M2 3h3.5L12 15l6.5-12H22L12 21 2 3m4.5 0h3L12 7.58 14.5 3h3L12 13.08 6.5 3z" />
  </svg>
);

const AngularIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L2 7l1.63 14.27L12 22l8.37-5.73L22 7L12 2zm0 2.1l6.85 2.14-1.26 10.97L12 19.77l-5.59-2.56-1.26-10.97L12 4.1zM8 16h2.14l.68-1.7h2.36l.68 1.7H16l-4-10-4 10zm3.44-3.48L12 11l.56 1.52h-1.12z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    className={`w-5 h-5 motion-safe:transition-transform motion-safe:duration-300 ${expanded ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

// Tooltip component for collapsed state
const Tooltip = ({ children, label, show }: { children: React.ReactNode; label: string; show: boolean }) => (
  <div className="relative group">
    {children}
    {show && (
      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-800" />
      </div>
    )}
  </div>
);

// Navigation items
const homeItem = { path: '/', label: 'Home', icon: HomeIcon, color: 'bg-slate-600', glowColor: 'shadow-slate-500/50' };

const microApps = [
  { path: '/react', label: 'React Remote', icon: ReactIcon, color: 'bg-sky-500', glowColor: 'shadow-sky-500/50' },
  { path: '/vue', label: 'Vue Remote', icon: VueIcon, color: 'bg-emerald-500', glowColor: 'shadow-emerald-500/50' },
  { path: '/angular', label: 'Angular Remote', icon: AngularIcon, color: 'bg-rose-500', glowColor: 'shadow-rose-500/50' },
];

export default function Shell({ children }: ShellProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-[72px]'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          <div className={`flex items-center gap-3 overflow-hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">MF</span>
            </div>
            <span className="font-semibold whitespace-nowrap">Microfrontend</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronIcon expanded={sidebarOpen} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {/* Home Item */}
          <Tooltip label={homeItem.label} show={!sidebarOpen}>
            <Link
              to={homeItem.path}
              className={`relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 overflow-hidden ${
                isActive(homeItem.path)
                  ? `bg-slate-700/50 text-white shadow-lg ${homeItem.glowColor}`
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {/* Active indicator - left border */}
              {isActive(homeItem.path) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              )}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isActive(homeItem.path) ? `${homeItem.color} shadow-md ${homeItem.glowColor}` : homeItem.color
                }`}
              >
                <homeItem.icon />
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'
                }`}
              >
                {homeItem.label}
              </span>
            </Link>
          </Tooltip>

          {/* MICRO APPS Section */}
          <div className="pt-4">
            <div
              className={`px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-all duration-300 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
              }`}
            >
              Micro Apps
            </div>
            <div className="space-y-1">
              {microApps.map((item) => (
                <Tooltip key={item.path} label={item.label} show={!sidebarOpen}>
                  <Link
                    to={item.path}
                    className={`relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 overflow-hidden ${
                      isActive(item.path)
                        ? `bg-slate-700/50 text-white shadow-lg ${item.glowColor}`
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {/* Active indicator - left border with glow */}
                    {isActive(item.path) && (
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${item.color}`}
                        style={{ boxShadow: `0 0 12px 2px currentColor` }}
                      />
                    )}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isActive(item.path) ? `${item.color} shadow-md ${item.glowColor}` : item.color
                      }`}
                    >
                      <item.icon />
                    </div>
                    <span
                      className={`whitespace-nowrap transition-all duration-300 ${
                        sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </Tooltip>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Tooltip label="All services running" show={!sidebarOpen}>
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full motion-safe:animate-pulse flex-shrink-0" aria-hidden="true"></div>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 absolute'
                }`}
              >
                All services running
              </span>
            </div>
          </Tooltip>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-64' : 'ml-[72px]'
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {isActive(homeItem.path)
                ? homeItem.label
                : microApps.find((item) => isActive(item.path))?.label || 'Dashboard'}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
