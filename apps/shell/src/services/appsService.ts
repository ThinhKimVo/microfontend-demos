/**
 * Apps Service - Facade re-exporting from specialized modules
 *
 * This file maintains backward compatibility while the implementation
 * has been split into:
 * - api/appsApi.ts - CRUD operations
 * - api/httpClient.ts - HTTP utilities
 * - utils/appHelpers.ts - Array utilities and generators
 * - constants/themes.ts - Gradient presets
 * - constants/config.ts - Configuration
 */

// Re-export API functions
export {
  checkAppAvailability,
  checkAppsAvailability,
  fetchApps as loadApps,
  createApp as addAppToDb,
  updateApp as updateAppInDb,
  deleteApp as deleteAppFromDb,
  saveAllApps as saveApps,
  uploadScreenshot,
} from '../api/appsApi';

// Re-export helper functions
export {
  getAppById,
  getAppByPath,
  addAppToList as addApp,
  updateAppInList as updateApp,
  removeAppFromList as deleteApp,
  generateAppId,
  createEmptyApp,
  exportAppsJson,
  downloadAppsJson,
} from '../utils/appHelpers';

// Re-export theme constants
export { gradientPresets } from '../constants/themes';
export type { GradientPreset } from '../constants/themes';

