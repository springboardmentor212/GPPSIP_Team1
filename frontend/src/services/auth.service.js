import api from "./api";

export async function register(userData) {
    try {
        const response = await api.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function login(email, password) {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        const response = await api.post("/auth/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/auth/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}

