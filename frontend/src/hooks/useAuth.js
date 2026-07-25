import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { register, login, logout } from "../services/auth.service";

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            const response = await login(email, password);
            if (response.success) {
                setUser(response.user);
            }
            return response;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (userData) => {
        setLoading(true);
        try {
            const response = await register(userData);
            if (response.success) {
                setUser(response.user);
            }
            return response;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await logout();
            if (response.success) {
                setUser(null);
            }
            return response;
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, handleLogin, handleRegister, handleLogout };
};

export default useAuth;
