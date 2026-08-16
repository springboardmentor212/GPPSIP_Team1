import api from './api';

export async function getAdminUsers(query = '', role = '') {
  const response = await api.get(`/admin/users?q=${encodeURIComponent(query)}&role=${encodeURIComponent(role)}`);
  return response.data;
}

export async function toggleUserStatus(id) {
  const response = await api.patch(`/admin/users/${id}/status`);
  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
}

export async function getAdminApplications() {
  const response = await api.get('/admin/applications');
  return response.data;
}

export async function getAdminAuditLogs() {
  const response = await api.get('/admin/audit-logs');
  return response.data;
}

export async function getAdminStats() {
  const response = await api.get('/admin/stats');
  return response.data;
}

export async function getAdminSettings() {
  const response = await api.get('/admin/settings');
  return response.data;
}

export async function updateAdminSettings(settingsData) {
  const response = await api.post('/admin/settings', settingsData);
  return response.data;
}
