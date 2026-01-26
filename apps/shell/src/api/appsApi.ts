import { AppInfo } from '../data/apps';
import { get, post, put, del, withApiResult } from './httpClient';
import { AVAILABILITY_TIMEOUT_MS } from '../constants/config';

function getRemoteBaseUrl(): string {
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}`;
}

export async function checkAppAvailability(app: AppInfo): Promise<boolean> {
  const baseUrl = getRemoteBaseUrl();
  const remoteEntryUrl = `${baseUrl}:${app.port}/remoteEntry.js`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AVAILABILITY_TIMEOUT_MS);

    const response = await fetch(remoteEntryUrl, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

export async function checkAppsAvailability(apps: AppInfo[]): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();
  await Promise.all(
    apps.map(async (app) => {
      const isAvailable = await checkAppAvailability(app);
      results.set(app.id, isAvailable);
    })
  );
  return results;
}

export async function fetchApps(): Promise<AppInfo[]> {
  try {
    console.log('[appsApi] Loading apps from API');
    const apps = await get<AppInfo[]>('/apps');
    console.log(`[appsApi] Loaded ${apps.length} apps from API`);
    return apps;
  } catch (e) {
    console.error('[appsApi] Failed to load apps from API:', e);
    try {
      console.log('[appsApi] Falling back to apps.json');
      const response = await fetch('/data/apps.json');
      if (response.ok) {
        return await response.json();
      }
    } catch {
      console.error('[appsApi] Failed to load fallback');
    }
    return [];
  }
}

export async function createApp(app: AppInfo) {
  return withApiResult(() => post<AppInfo>('/apps', app));
}

export async function updateApp(app: AppInfo) {
  return withApiResult(() => put<AppInfo>(`/apps/${app.id}`, app));
}

export async function deleteApp(id: string) {
  return withApiResult(() => del<void>(`/apps/${id}`));
}

export async function saveAllApps(apps: AppInfo[]) {
  return withApiResult(async () => {
    console.log(`[appsApi] Saving ${apps.length} apps to API`);
    // async-parallel: Use Promise.all for independent operations
    await Promise.all(apps.map(app => put<AppInfo>(`/apps/${app.id}`, app)));
    console.log('[appsApi] Successfully saved to API');
  });
}

export async function uploadScreenshot(
  filename: string,
  data: string,
  appId: string,
  alt: string = ''
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    console.log(`[appsApi] Uploading screenshot: ${filename}`);
    const result = await post<{ success: boolean; path: string }>(
      '/upload-screenshot',
      { filename, data, appId, alt }
    );
    console.log(`[appsApi] Screenshot uploaded: ${result.path}`);
    return { success: true, path: result.path };
  } catch (err) {
    const errorMsg = (err as Error).message || String(err);
    console.error('[appsApi] Upload failed:', err);
    return { success: false, error: errorMsg };
  }
}
