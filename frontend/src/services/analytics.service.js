import api from './api';

export const getKPIs = async (timeRange) => {
    const res = await api.get('/analytics/kpis', { params: { timeRange } });
    return res.data;
};

export const getTrends = async (timeRange) => {
    const res = await api.get('/analytics/trends', { params: { timeRange } });
    return res.data;
};

export const getDepartmentAnalytics = async (timeRange) => {
    const res = await api.get('/analytics/departments', { params: { timeRange } });
    return res.data;
};
