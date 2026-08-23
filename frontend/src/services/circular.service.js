import api from './api';

export const getCirculars = async (filters = {}) => {
    const { status, category } = filters;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);

    const response = await api.get(`/circulars?${params.toString()}`);
    return response.data;
};

export const getCircularById = async (id) => {
    const response = await api.get(`/circulars/${id}`);
    return response.data;
};

export const createCircular = async (circularData) => {
    const response = await api.post('/circulars', circularData);
    return response.data;
};

export const updateCircular = async (id, circularData) => {
    const response = await api.put(`/circulars/${id}`, circularData);
    return response.data;
};

export const deleteCircular = async (id) => {
    const response = await api.delete(`/circulars/${id}`);
    return response.data;
};
