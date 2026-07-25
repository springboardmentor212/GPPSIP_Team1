import api from './api';

/**
 * Fetch all schemes from the database.
 * @returns {Promise<{ success: boolean, schemes: Array }>}
 */
export async function getSchemes() {
  try {
    const response = await api.get('/schemes');
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch a specific scheme by its ID.
 * @param {string} id - Database ID of the scheme
 * @returns {Promise<{ success: boolean, scheme: Object }>}
 */
export async function getSchemeById(id) {
  try {
    const response = await api.get(`/schemes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
