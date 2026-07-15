import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true // Important for sending/receiving the jwt_token cookie
});

export async function register(userData) {
    try {
        const response = await api.post("/register", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function login(email, password) {
    try {
        const response = await api.post("/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function logout() {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/me");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
