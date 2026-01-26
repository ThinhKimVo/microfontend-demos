import { API_BASE } from '../constants/config';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse<T>(response);
}

export async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function put<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function del<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
  });
  return handleResponse<T>(response);
}

export async function withApiResult<T>(
  fn: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error };
  }
}
