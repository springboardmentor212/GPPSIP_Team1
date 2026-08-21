import api from './api';

export const exportReport = async (reportData) => {
    const res = await api.post('/reports/export', reportData);
    return res.data;
};

export const scheduleReport = async (scheduleData) => {
    const res = await api.post('/reports/schedule', scheduleData);
    return res.data;
};

export const getReports = async () => {
    const res = await api.get('/reports');
    return res.data;
};

export const getSchedules = async () => {
    const res = await api.get('/reports/schedules');
    return res.data;
};

export const deleteSchedule = async (id) => {
    const res = await api.delete(`/reports/schedules/${id}`);
    return res.data;
};

export const downloadReportUrl = (id) => {
    return `${api.defaults.baseURL}/reports/download/${id}`;
};
