import { api } from './api';

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboard = () =>
  api.get('/admin/dashboard').then((r) => r.data);

// ─── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = (params: { page?: number; limit?: number; search?: string; status?: string }) =>
  api.get('/users', { params }).then((r) => r.data);

export const updateUserStatus = (id: string, status: string) =>
  api.patch(`/users/${id}/status`, { status }).then((r) => r.data);

export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`).then((r) => r.data);

// ─── Therapists ────────────────────────────────────────────────────────────────
export const getTherapists = (params: { page?: number; limit?: number; search?: string; verificationStatus?: string }) =>
  api.get('/therapists', { params }).then((r) => r.data);

export const updateTherapistVerification = (id: string, status: string, reason?: string) =>
  api.patch(`/therapists/${id}/verification`, { status, reason }).then((r) => r.data);

// ─── Appointments ──────────────────────────────────────────────────────────────
export const getAppointments = (params: { page?: number; limit?: number; search?: string; status?: string; dateFrom?: string; dateTo?: string }) =>
  api.get('/appointments/all', { params }).then((r) => r.data);

export const adminCancelAppointment = (id: string, reason: string) =>
  api.patch(`/appointments/${id}/admin-cancel`, { reason }).then((r) => r.data);

// ─── Payments ──────────────────────────────────────────────────────────────────
export const getPayments = (params: { page?: number; limit?: number; status?: string; dateFrom?: string; dateTo?: string }) =>
  api.get('/payments/all', { params }).then((r) => r.data);

// ─── Categories (Specializations) ─────────────────────────────────────────────
export const getCategories = () =>
  api.get('/therapists/specializations').then((r) => r.data);

export const createCategory = (data: { name: string; description?: string; icon?: string }) =>
  api.post('/therapists/specializations', data).then((r) => r.data);

export const updateCategory = (id: string, data: { name?: string; description?: string; icon?: string; isActive?: boolean }) =>
  api.patch(`/therapists/specializations/${id}`, data).then((r) => r.data);

export const deleteCategory = (id: string) =>
  api.delete(`/therapists/specializations/${id}`).then((r) => r.data);

// ─── Settings ──────────────────────────────────────────────────────────────────
export const getSettings = () =>
  api.get('/admin/settings').then((r) => r.data);

export const updateSettings = (data: Record<string, string>) =>
  api.post('/admin/settings', data).then((r) => r.data);

// ─── Support Tickets ───────────────────────────────────────────────────────────
export const getSupportTickets = (params: { page?: number; limit?: number; search?: string; status?: string }) =>
  api.get('/admin/support', { params }).then((r) => r.data);

export const updateSupportTicket = (id: string, data: { status?: string }) =>
  api.patch(`/admin/support/${id}`, data).then((r) => r.data);
