// In development, API is proxied through webpack devServer
// In production, API server runs on port 3150
function getApiBase(): string {
  // Check if we're in development by looking at the port
  // Development runs on 3100 with webpack dev server proxy
  const isDev = typeof window !== 'undefined' && window.location.port === '3100' && window.location.hostname === 'localhost';
  if (isDev) {
    return '/api';
  }
  // Production: API server on port 3150
  return `http://localhost:3150/api`;
}

export const API_BASE = getApiBase();
export const AVAILABILITY_TIMEOUT_MS = 3000;
