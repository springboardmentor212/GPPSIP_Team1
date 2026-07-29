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

/**
 * Create a new policy
 * @param {Object} policyData
 * @returns {Promise<{ success: boolean, policy: Object }>}
 */
export async function createPolicy(policyData) {
  try {
    const response = await api.post('/policies', policyData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing policy
 * @param {string} id - Database ID of the policy
 * @param {Object} updateData
 * @returns {Promise<{ success: boolean, policy: Object }>}
 */
export async function updatePolicy(id, updateData) {
  try {
    const response = await api.put(`/policies/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Archive a policy (change status to Archived)
 * @param {string} id - Database ID of the policy
 * @returns {Promise<{ success: boolean, policy: Object }>}
 */
export async function archivePolicy(id) {
  try {
    const response = await api.patch(`/policies/${id}/status`, { status: 'Archived' });
    return response.data;
  } catch (error) {
    throw error;
  }
}
