import api from './api';

/**
 * Submit a policy for approval (Draft -> Pending)
 * @param {string} id - Policy ID
 * @param {string} comments - Optional comments
 * @returns {Promise<{ success: boolean, policy: Object }>}
 */
export async function submitForApproval(id, comments = '') {
  try {
    const response = await api.patch(`/policies/${id}/submit`, { comments });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Approve a policy (Pending -> Approved)
 * @param {string} id - Policy ID
 * @param {string} comments - Optional comments
 * @returns {Promise<{ success: boolean, policy: Object }>}
 */
export async function approvePolicy(id, comments = '') {
  try {
    const response = await api.patch(`/policies/${id}/approve`, { comments });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Reject a policy (Pending -> Rejected)
 * @param {string} id - Policy ID
 * @param {string} comments - Rejection reason (required)
 * @returns {Promise<{ success: boolean, policy: Object }>}
 */
export async function rejectPolicy(id, comments) {
  try {
    const response = await api.patch(`/policies/${id}/reject`, { comments });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Archive a policy (Approved -> Archived)
 * @param {string} id - Policy ID
 * @param {string} comments - Optional comments
 * @returns {Promise<{ success: boolean, policy: Object }>}
 */
export async function archivePolicy(id, comments = '') {
  try {
    const response = await api.patch(`/policies/${id}/archive`, { comments });
    return response.data;
  } catch (error) {
    throw error;
  }
}
