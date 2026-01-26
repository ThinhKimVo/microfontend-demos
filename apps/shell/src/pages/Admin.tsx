import React, { useState, useEffect } from 'react';
import { AppInfo } from '../data/apps';
import {
  loadApps,
  downloadAppsJson,
  addAppToDb,
  updateAppInDb,
  deleteAppFromDb,
  generateAppId,
  createEmptyApp,
  uploadScreenshot,
} from '../services/appsService';
import { Sidebar, Dashboard, AppsGrid, EditAppDrawer } from '../components/Admin';
import { LoadingScreen } from '../components/LoadingScreen';
import { useMessage } from '../hooks';

const Admin: React.FC = () => {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState<AppInfo | null>(null);
  const [isNewApp, setIsNewApp] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Persist sidebar state in localStorage
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved === 'true';
  });
  const { message, showMessage } = useMessage();

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem('admin-sidebar-collapsed', String(newValue));
      return newValue;
    });
  };

  const reloadApps = () => {
    loadApps().then((data) => {
      setApps(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    reloadApps();
  }, []);

  const handleExport = () => {
    downloadAppsJson(apps);
    showMessage('success', 'Apps data exported successfully');
  };

  const handleRefresh = () => {
    setLoading(true);
    reloadApps();
    showMessage('success', 'Data refreshed from database');
  };

  const handleAddApp = () => {
    setEditingApp(createEmptyApp() as AppInfo);
    setIsNewApp(true);
  };

  const handleEditApp = (app: AppInfo) => {
    setEditingApp({ ...app });
    setIsNewApp(false);
  };

  const handleDeleteApp = async (id: string) => {
    if (confirm('Are you sure you want to delete this app? This action cannot be undone.')) {
      const result = await deleteAppFromDb(id);
      if (result.success) {
        setApps(apps.filter(app => app.id !== id));
        showMessage('success', 'App deleted successfully');
      } else {
        showMessage('error', `Failed to delete: ${result.error}`);
      }
    }
  };

  const handleSaveApp = async () => {
    if (!editingApp) return;

    if (!editingApp.name || !editingApp.path || !editingApp.description) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    let appToSave = { ...editingApp, screenshots: [...(editingApp.screenshots || [])] };
    if (isNewApp) {
      appToSave.id = generateAppId(appToSave.name);
    }

    if (!appToSave.path.startsWith('/')) {
      appToSave.path = '/' + appToSave.path;
    }

    const screenshots = appToSave.screenshots || [];
    const base64Screenshots = screenshots.filter(s => s.url.startsWith('data:image'));

    if (base64Screenshots.length > 0) {
      const updatedScreenshots = [...screenshots];
      let savedCount = 0;

      for (let i = 0; i < screenshots.length; i++) {
        const screenshot = screenshots[i];
        if (!screenshot.url.startsWith('data:image')) continue;

        const filename = `${appToSave.id}-${i + 1}.png`;

        try {
          const result = await uploadScreenshot(
            filename,
            screenshot.url,
            appToSave.id,
            screenshot.alt || filename
          );

          if (result.success && result.path) {
            updatedScreenshots[i] = { ...screenshot, url: result.path };
            savedCount++;
          } else {
            throw new Error(result.error || 'Unknown error');
          }
        } catch (err) {
          const errorMsg = (err as Error).message || String(err);
          console.error('Failed to save image:', err);
          showMessage('error', `Failed to save image: ${errorMsg}`);
          return;
        }
      }

      appToSave.screenshots = updatedScreenshots;
      console.log(`[Admin] Saved ${savedCount} image(s)`);
    }

    let result;
    if (isNewApp) {
      result = await addAppToDb(appToSave);
    } else {
      result = await updateAppInDb(appToSave);
    }

    if (result.success) {
      if (isNewApp) {
        setApps([...apps, appToSave]);
      } else {
        setApps(apps.map(app => app.id === appToSave.id ? appToSave : app));
      }
      setEditingApp(null);
      const imgMsg = base64Screenshots.length > 0 ? ` with ${base64Screenshots.length} screenshot(s)` : '';
      showMessage('success', `${isNewApp ? 'App created' : 'App updated'}${imgMsg}`);
    } else {
      showMessage('error', `Failed to save: ${result.error}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingApp(null);
    setIsNewApp(false);
  };

  if (loading) {
    return <LoadingScreen message="Loading admin panel…" fullScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        appCount={apps.length}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-slate-900 capitalize">
                {activeSection === 'apps' ? 'Applications' : activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Refresh data"
              >
                <RefreshIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <DownloadIcon className="w-4 h-4" aria-hidden="true" />
                Export
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activeSection === 'dashboard' && (
            <Dashboard
              apps={apps}
              onAddApp={handleAddApp}
              onGoToApps={() => setActiveSection('apps')}
            />
          )}

          {activeSection === 'apps' && (
            <AppsGrid
              apps={apps}
              onEdit={handleEditApp}
              onDelete={handleDeleteApp}
              onAdd={handleAddApp}
            />
          )}

          {activeSection === 'media' && (
            <MediaLibrary apps={apps} />
          )}

          {activeSection === 'settings' && (
            <Settings onExport={handleExport} />
          )}
        </div>
      </main>

      {/* Edit Drawer */}
      {editingApp && (
        <EditAppDrawer
          app={editingApp}
          isNew={isNewApp}
          onChange={setEditingApp}
          onSave={handleSaveApp}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Toast Message */}
      {message && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-slide-up ${
            message.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <XCircleIcon className="w-5 h-5" aria-hidden="true" />
          )}
          {message.text}
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Media Library Section
const MediaLibrary: React.FC<{ apps: AppInfo[] }> = ({ apps }) => {
  const allScreenshots = apps.flatMap(app =>
    (app.screenshots || []).map(s => ({ ...s, appName: app.name, appId: app.id }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
        <p className="text-slate-500">All screenshots from your applications</p>
      </div>

      {allScreenshots.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allScreenshots.map((screenshot, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <img
                  src={screenshot.url}
                  alt={screenshot.alt}
                  width={320}
                  height={180}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50%" y="50%" fill="%2394a3b8" font-size="12" text-anchor="middle" dy=".3em">No image</text></svg>';
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-slate-900 truncate">{screenshot.alt || 'Screenshot'}</p>
                <p className="text-xs text-slate-500">{screenshot.appName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No media yet</h3>
          <p className="text-slate-500">Upload screenshots to your apps to see them here</p>
        </div>
      )}
    </div>
  );
};

// Settings Section
const Settings: React.FC<{ onExport: () => void }> = ({ onExport }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Configure your admin panel</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Export Apps Data</p>
              <p className="text-sm text-slate-500">Download all apps as JSON file</p>
            </div>
            <button
              onClick={onExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Database</h2>
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="font-medium text-green-800">PostgreSQL Connected</p>
            <p className="text-sm text-green-600">Database is running and connected</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">About</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Version</span>
            <span className="font-medium text-slate-900">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Admin Panel</span>
            <span className="font-medium text-slate-900">Demos Admin CMS</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">API Server</span>
            <span className="font-medium text-slate-900">Port 3150</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons
const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default Admin;
