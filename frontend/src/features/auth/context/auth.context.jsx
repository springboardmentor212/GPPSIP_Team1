import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/auth.api";

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

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9]">
                <div className="w-12 h-12 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
