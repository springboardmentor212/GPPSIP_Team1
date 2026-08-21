import api from './api';

/**
 * Submit a new application for a scheme.
 * @param {string} schemeId - Database ID of the scheme
 * @returns {Promise<{ success: boolean, message: string, application: Object }>}
 */
export async function applyForScheme(schemeId, documents = []) {
  try {
    const response = await api.post('/applications', { schemeId, documents });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get applications submitted by the logged-in citizen.
 * @returns {Promise<{ success: boolean, applications: Array }>}
 */
export async function getMyApplications() {
  try {
    const response = await api.get('/applications/my');
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get pending applications for official review.
 * @param {string} status - Filter status ('All', 'Pending', 'Approved', 'Rejected')
 * @returns {Promise<{ success: boolean, applications: Array }>}
 */
export async function getPendingApplications(status = 'All') {
  try {
    const response = await api.get('/applications/pending', {
      params: { status }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get complete application details.
 * @param {string} id - Database ID of the application
 * @returns {Promise<{ success: boolean, application: Object }>}
 */
export async function getApplicationDetails(id) {
  try {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Approve a scheme application.
 * @param {string} id - Application ID
 * @param {string} comments - Optional comments
 * @returns {Promise<{ success: boolean, message: string, application: Object }>}
 */
export async function approveApplication(id, comments = '') {
  try {
    const response = await api.patch(`/applications/${id}/approve`, { comments });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Reject a scheme application.
 * @param {string} id - Application ID
 * @param {string} comments - Rejection reason (comments)
 * @returns {Promise<{ success: boolean, message: string, application: Object }>}
 */
export async function rejectApplication(id, comments) {
  try {
    const response = await api.patch(`/applications/${id}/reject`, { comments });
    return response.data;
  } catch (error) {
    throw error;
  }
}
