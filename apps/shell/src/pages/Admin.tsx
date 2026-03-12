import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../contexts/AuthContext';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { message, showMessage } = useMessage();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar wrapper – overlay on mobile, sticky column on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-40 md:sticky md:top-0 md:h-screen md:z-auto md:inset-auto md:flex-shrink-0 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          appCount={apps.length}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          user={user}
          onLogout={handleLogout}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 glass-panel border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              {/* Hamburger – mobile only */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-500 hover:text-accent-cyan hover:bg-white/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                aria-label="Open navigation menu"
              >
                <MenuIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <h1 className="text-xl font-bold tracking-tight text-white capitalize">
                {activeSection === 'apps' ? 'Applications' : activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-slate-500 hover:text-accent-cyan hover:bg-white/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                aria-label="Refresh data"
              >
                <RefreshIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={handleExport}
                className="hidden sm:flex px-4 py-2 text-slate-400 hover:text-white border border-white/10 rounded-xl hover:bg-accent-cyan/10 transition-colors items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                <DownloadIcon className="w-4 h-4" aria-hidden="true" />
                Export
              </button>
              {/* Mobile export icon-only button */}
              <button
                onClick={handleExport}
                className="sm:hidden p-2 text-slate-500 hover:text-accent-cyan hover:bg-white/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                aria-label="Export data"
              >
                <DownloadIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
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
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-slide-up ${message.type === 'success'
            ? 'bg-accent-cyan text-obsidian font-bold'
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
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <p className="text-slate-500">All screenshots from your applications</p>
      </div>

      {allScreenshots.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allScreenshots.map((screenshot, index) => (
            <div key={index} className="glass-panel rounded-xl overflow-hidden group">
              <div className="aspect-video bg-white/5 relative overflow-hidden">
                <img
                  src={screenshot.url}
                  alt={screenshot.alt}
                  width={320}
                  height={180}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%230A0A0B" width="100" height="100"/><text x="50%" y="50%" fill="%2394a3b8" font-size="12" text-anchor="middle" dy=".3em">No image</text></svg>';
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{screenshot.alt || 'Screenshot'}</p>
                <p className="text-xs text-slate-500">{screenshot.appName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium text-white mb-2">No media yet</h3>
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
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500">Configure your admin panel</p>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
            <div>
              <p className="font-medium text-white">Export Apps Data</p>
              <p className="text-sm text-slate-500">Download all apps as JSON file</p>
            </div>
            <button
              onClick={onExport}
              className="px-4 py-2 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-accent-cyan hover:text-obsidian hover:border-accent-cyan transition-colors"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Database</h2>
        <div className="flex items-center gap-4 p-4 bg-accent-cyan/10 rounded-xl border border-accent-cyan/20">
          <div className="w-3 h-3 bg-accent-cyan rounded-full animate-pulse"></div>
          <div>
            <p className="font-medium text-accent-cyan">PostgreSQL Connected</p>
            <p className="text-sm text-accent-cyan/70">Database is running and connected</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">About</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-slate-500">Version</span>
            <span className="font-medium text-white">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-slate-500">Admin Panel</span>
            <span className="font-medium text-white">Demos Admin CMS</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">API Server</span>
            <span className="font-medium text-white">Port 3150</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

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
