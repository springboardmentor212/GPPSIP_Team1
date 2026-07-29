import api from './api';

/**
 * Unified Search for Policies and Schemes
 * @param {Object} params - Search parameters
 * @param {string} params.q - Keyword search (title/description)
 * @param {string} params.category - Category filter
 * @param {string} params.department - Department filter
 * @param {string} params.status - Status filter
 * @returns {Promise<{ success: boolean, policies: Array, schemes: Array }>}
 */
export async function searchAll(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/search?${queryString}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
