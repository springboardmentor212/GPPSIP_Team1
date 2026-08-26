import api from './api';

export const saveScheme = async (schemeId) => {
    const response = await api.post('/saved-schemes', { schemeId });
    return response.data;
};

export const getSavedSchemes = async () => {
    const response = await api.get('/saved-schemes');
    return response.data;
};

export const removeSavedScheme = async (schemeId) => {
    const response = await api.delete(`/saved-schemes/${schemeId}`);
    return response.data;
};

export const checkSavedScheme = async (schemeId) => {
    const response = await api.get(`/saved-schemes/check/${schemeId}`);
    return response.data;
};

export const toggleSaveScheme = async (schemeId) => {
    const response = await api.post('/saved-schemes/toggle', { schemeId });
    return response.data;
};
