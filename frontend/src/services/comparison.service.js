import api from './api';

/**
 * Compare multiple policies
 * @param {string[]} policyIds - Array of policy IDs (2-4)
 * @returns {Promise<{ success: boolean, comparison: Object }>}
 */
export async function comparePolicies(policyIds) {
  try {
    const response = await api.post('/compare/policies', { ids: policyIds });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Compare multiple schemes
 * @param {string[]} schemeIds - Array of scheme IDs (2-4)
 * @returns {Promise<{ success: boolean, comparison: Object }>}
 */
export async function compareSchemes(schemeIds) {
  try {
    const response = await api.post('/compare/schemes', { ids: schemeIds });
    return response.data;
  } catch (error) {
    throw error;
  }
}
