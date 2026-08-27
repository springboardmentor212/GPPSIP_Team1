import api from './api';

export const savePolicy = async (policyId) => {
    const response = await api.post('/saved-policies', { policyId });
    return response.data;
};

export const getSavedPolicies = async () => {
    const response = await api.get('/saved-policies');
    return response.data;
};

export const removeSavedPolicy = async (policyId) => {
    const response = await api.delete(`/saved-policies/${policyId}`);
    return response.data;
};

export const checkSavedPolicy = async (policyId) => {
    const response = await api.get(`/saved-policies/check/${policyId}`);
    return response.data;
};

export const toggleSavePolicy = async (policyId) => {
    const response = await api.post('/saved-policies/toggle', { policyId });
    return response.data;
};
