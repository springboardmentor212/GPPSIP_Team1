import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/auth.service";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const data = await getMe();
                if (data.success && data.user) {
                    setUser(data.user);
                }
            } catch {
                // No active session or token expired
                console.log("No active session.");
            } finally {
                setIsInitializing(false);
            }
        };

        verifySession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, isInitializing }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
