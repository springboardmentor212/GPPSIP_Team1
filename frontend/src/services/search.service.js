import api from './api';

export async function searchAll(query, category, department, status) {
  try {
    const params = {};
    if (query) params.q = query;
    if (category && category !== 'All Categories' && category !== 'All Schemes') params.category = category;
    if (department && department !== 'All Depts') params.department = department;
    if (status && status !== 'All Statuses') params.status = status;

    const response = await api.get('/search', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
}
