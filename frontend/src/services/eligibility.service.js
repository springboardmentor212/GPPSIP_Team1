import api from './api';

/**
 * Assess eligibility for a specific scheme.
 * 
 * @param {string} schemeId - The ID of the scheme
 * @param {Object} requestData - The user profile data
 * @returns {Promise<{ success: boolean, eligible: boolean, failedCriteria: string[] }>}
 */
export async function checkSchemeEligibility(schemeId, requestData) {
  try {
    const response = await api.post(`/schemes/${schemeId}/check-eligibility`, requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
