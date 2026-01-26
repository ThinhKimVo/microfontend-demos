import React from 'react';
import { AppInfo } from '../../data/apps';

interface DashboardProps {
  apps: AppInfo[];
  onAddApp: () => void;
  onGoToApps: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ apps, onAddApp, onGoToApps }) => {
  const deployedApps = apps.filter(app => app.integrated);
  const totalScreenshots = apps.reduce((sum, app) => sum + (app.screenshots?.length || 0), 0);
  const frameworks = [...new Set(apps.map(app => app.framework))];

  const stats = [
    { label: 'Total Apps', value: apps.length, icon: AppsIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Deployed', value: deployedApps.length, icon: CheckIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Screenshots', value: totalScreenshots, icon: ImageIcon, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Frameworks', value: frameworks.length, icon: CodeIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Welcome back</h1>
        <p className="text-slate-500 text-sm mb-5">Manage your microfrontend applications from one place.</p>
        <div className="flex gap-3">
          <button
            onClick={onAddApp}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add New App
          </button>
          <button
            onClick={onGoToApps}
            className="px-4 py-2 text-slate-600 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            View All Apps
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="text-slate-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={onAddApp}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Create New App</p>
                <p className="text-xs text-slate-500">Add a new application</p>
              </div>
            </button>
            <button
              onClick={onGoToApps}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <AppsIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Manage Apps</p>
                <p className="text-xs text-slate-500">Edit or delete apps</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
              <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                <DownloadIcon className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Export Data</p>
                <p className="text-xs text-slate-500">Download as JSON</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Apps */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent Apps</h2>
            <button onClick={onGoToApps} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {apps.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm">
                  {app.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{app.name}</p>
                  <p className="text-xs text-slate-500 truncate">{app.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {app.framework}
                  </span>
                  {app.integrated ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      Draft
                    </span>
                  )}
                </div>
              </div>
            ))}
            {apps.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <AppsIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No apps yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Framework Distribution */}
      {frameworks.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Framework Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {frameworks.map((framework) => {
              const count = apps.filter(app => app.framework === framework).length;
              const percentage = Math.round((count / apps.length) * 100) || 0;
              return (
                <div key={framework} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">{framework}</span>
                    <span className="text-xs text-slate-500">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Icons
const AppsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
