import api from './api';

export async function comparePolicies(ids) {
  try {
    const response = await api.post('/compare/policies', { ids });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function compareSchemes(ids) {
  try {
    const response = await api.post('/compare/schemes', { ids });
    return response.data;
  } catch (error) {
    throw error;
  }
}
