// API base URL configuration
// In development: proxied through webpack devServer
// In production: use relative /api path (nginx proxies to port 3150)
function getApiBase(): string {
  // Always use relative /api path - it works for both:
  // - Development: webpack devServer proxies to localhost:3150
  // - Production: nginx proxies to localhost:3150
  return '/api';
}

export const API_BASE = getApiBase();
export const AVAILABILITY_TIMEOUT_MS = 3000;
