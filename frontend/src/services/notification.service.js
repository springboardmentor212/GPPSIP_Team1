import api from './api';

/**
 * Fetch notifications from the database
 */
export async function getNotifications() {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications", error);
    throw error;
  }
}

/**
 * Mark a specific notification as read
 */
export async function markAsRead(id) {
  try {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read", error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead() {
  try {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read", error);
    throw error;
  }
}

/**
 * Delete a specific notification
 */
export async function deleteNotification(id) {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification", error);
    throw error;
  }
}
