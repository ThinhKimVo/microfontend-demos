import { AppInfo } from '../data/apps';

export function getAppById(apps: AppInfo[], id: string): AppInfo | undefined {
  return apps.find(app => app.id === id);
}

export function getAppByPath(apps: AppInfo[], path: string): AppInfo | undefined {
  return apps.find(app => app.path === path);
}

export function addAppToList(apps: AppInfo[], app: AppInfo): AppInfo[] {
  return [...apps, app];
}

export function updateAppInList(apps: AppInfo[], updatedApp: AppInfo): AppInfo[] {
  return apps.map(app => app.id === updatedApp.id ? updatedApp : app);
}

export function removeAppFromList(apps: AppInfo[], id: string): AppInfo[] {
  return apps.filter(app => app.id !== id);
}

export function generateAppId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function createEmptyApp(): Partial<AppInfo> {
  return {
    id: '',
    name: '',
    path: '',
    framework: 'React',
    port: 3109,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: '',
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    screenshots: [],
    detailContent: '',
    integrated: false,
    iosAppUrl: '',
    androidAppUrl: '',
  };
}

export function exportAppsJson(apps: AppInfo[]): string {
  return JSON.stringify(apps, null, 2);
}

export function downloadAppsJson(apps: AppInfo[]): void {
  const json = exportAppsJson(apps);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'apps.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
