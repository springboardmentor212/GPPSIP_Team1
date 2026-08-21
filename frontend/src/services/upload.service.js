import api from './api';

/**
 * Upload a single document
 * @param {File} file - The file object to upload
 * @returns {Promise<{ success: boolean, fileUrl: string, originalName: string }>}
 */
export async function uploadDocument(file) {
  try {
    const formData = new FormData();
    formData.append('document', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
