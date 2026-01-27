import React from 'react';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  appCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  appCount,
  collapsed,
  onToggleCollapse,
  user,
  onLogout,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'apps', label: 'Applications', icon: AppsIcon, badge: appCount },
    { id: 'media', label: 'Media Library', icon: MediaIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`bg-slate-900 min-h-screen flex flex-col transition-all duration-300 relative border-r border-slate-800 ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {/* Toggle Button - On border between sidebar and main */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-[88px] -right-3 z-50 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <CollapseIcon className={`w-3 h-3 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {/* Header with Logo */}
      <div className={`border-b border-slate-800 p-4 h-[72px] flex items-center ${collapsed ? 'justify-center' : ''}`}>
        <Link to="/" className={`flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg ${collapsed ? 'justify-center' : ''}`} aria-label="Go to home page">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-white font-semibold text-base whitespace-nowrap">Demos Admin</h1>
              <p className="text-slate-500 text-xs whitespace-nowrap">Content Management</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-4 ${collapsed ? 'px-2' : 'px-3'}`} aria-label="Admin navigation">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  collapsed ? 'px-3 py-2.5 justify-center' : 'px-3 py-2.5'
                } ${
                  activeSection === item.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                aria-label={collapsed ? item.label : undefined}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {activeSection === item.id && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium whitespace-nowrap">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`min-w-[20px] h-5 px-1.5 text-xs font-medium rounded flex items-center justify-center ${
                        activeSection === item.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-blue-600 text-white text-[10px] font-medium rounded flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Database Status */}
      <div className={`border-t border-slate-800 ${collapsed ? 'p-3' : 'p-3'}`}>
        {collapsed ? (
          <div className="flex justify-center py-2" title="Database Connected">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-slate-300 text-xs font-medium">Connected</p>
              <p className="text-slate-500 text-[10px]">PostgreSQL</p>
            </div>
          </div>
        )}
      </div>

      {/* User Info & Logout */}
      {user && (
        <div className={`border-t border-slate-800 ${collapsed ? 'p-2' : 'p-3'}`}>
          {collapsed ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all"
              title={`Logout (${user.name})`}
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5" />
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium truncate">{user.name}</p>
                  <p className="text-slate-500 text-xs truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all"
              >
                <LogoutIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Back to Site */}
      <div className={`border-t border-slate-800 ${collapsed ? 'p-2' : 'p-3'}`}>
        <Link
          to="/"
          className={`flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            collapsed ? 'px-3 py-2.5 justify-center' : 'px-3 py-2.5'
          }`}
          aria-label={collapsed ? 'Back to Site' : undefined}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          {!collapsed && <span className="text-sm font-medium whitespace-nowrap">Back to Site</span>}
        </Link>
      </div>
    </aside>
  );
};

// Icons
const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const AppsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const MediaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CollapseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
