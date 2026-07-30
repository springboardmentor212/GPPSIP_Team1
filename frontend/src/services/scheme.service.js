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

/**
 * Create a new scheme
 * @param {Object} schemeData
 * @returns {Promise<{ success: boolean, scheme: Object }>}
 */
export async function createScheme(schemeData) {
  try {
    const response = await api.post('/schemes', schemeData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing scheme
 * @param {string} id - Database ID of the scheme
 * @param {Object} updateData
 * @returns {Promise<{ success: boolean, scheme: Object }>}
 */
export async function updateScheme(id, updateData) {
  try {
    const response = await api.put(`/schemes/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Archive a scheme (change status to Archived)
 * @param {string} id - Database ID of the scheme
 * @returns {Promise<{ success: boolean, scheme: Object }>}
 */
export async function archiveScheme(id) {
  try {
    const response = await api.patch(`/schemes/${id}/archive`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
