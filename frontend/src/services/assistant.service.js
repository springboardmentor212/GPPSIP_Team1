import api from './api';

export const askAssistant = async (question) => {
    const response = await api.post('/assistant/ask', { question });
    return response.data;
};

export const getAssistantSuggestions = async () => {
    const response = await api.get('/assistant/suggestions');
    return response.data;
};
