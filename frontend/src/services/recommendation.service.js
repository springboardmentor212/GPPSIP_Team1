import api from './api';

/**
 * Fetch scheme recommendations based on user profile or form data
 * @param {Object} formData Optional form data for anonymous or targeted checks
 */
export const getRecommendations = async (formData = {}) => {
    try {
        const response = await api.post('/recommendations', formData);
        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations", error);
        throw error;
    }
};
