// API base URL configuration
// In development: webpack devServer proxies /api to localhost:3150
// In production: Express static server proxies /api to localhost:3150
function getApiBase(): string {
  return '/api';
}

export const API_BASE = getApiBase();
export const AVAILABILITY_TIMEOUT_MS = 3000;
