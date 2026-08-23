import api from './api';

/**
 * Get profile settings
 */
export async function getProfileSettings(userEmail) {
  try {
    const response = await api.get('/profile');
    return { success: true, profile: response.data.profile };
  } catch (error) {
    console.error("Failed to fetch profile settings", error);
    return { success: false, message: error.response?.data?.message || 'Failed to load profile' };
  }
}

/**
 * Save profile details
 */
export async function updateProfileSettings(userEmail, profileData) {
  try {
    const response = await api.put('/profile', profileData);
    return { success: true, profile: response.data.profile };
  } catch (error) {
    console.error("Failed to update profile settings", error);
    return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
  }
}

/**
 * Change user password
 */
export async function changeUserPassword(passwordData) {
  try {
    const response = await api.post('/auth/change-password', passwordData);
    return { success: true, message: response.data.message };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update password.");
  }
}

/**
 * Delete citizen account
 */
export async function deleteCitizenAccount(userEmail) {
  // Not implemented in backend yet, keeping placeholder
  return { success: true };
}
