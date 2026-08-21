import api from './api';

export const getSessions = async () => {
    const res = await api.get('/assistant/sessions');
    return res.data;
};

export const getSession = async (id) => {
    const res = await api.get(`/assistant/sessions/${id}`);
    return res.data;
};

export const chat = async (message, sessionId) => {
    const res = await api.post('/assistant/chat', { message, sessionId });
    return res.data;
};

export const deleteSession = async (id) => {
    const res = await api.delete(`/assistant/sessions/${id}`);
    return res.data;
};
