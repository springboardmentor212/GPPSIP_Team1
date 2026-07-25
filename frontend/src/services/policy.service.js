import api from './api';

/**
 * Fetch all policies from the database.
 * @returns {Promise<{ success: boolean, policies: Array }>}
 */
export async function getPolicies() {
  try {
    const response = await api.get('/policies');
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch a specific policy by its ID.
 * @param {string} id - Database ID of the policy
 * @returns {Promise<{ success: boolean, policy: Object }>}
 */
export async function getPolicyById(id) {
  try {
    const response = await api.get(`/policies/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
