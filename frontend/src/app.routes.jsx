import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import StandalonePolicyPage from "./pages/Policies/StandalonePolicyPage";
import useAuth from "./hooks/useAuth";

const GuestRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/login",
        element: (
            <GuestRoute>
                <Login />
            </GuestRoute>
        ),
    },
    {
        path: "/register",
        element: (
            <GuestRoute>
                <Register />
            </GuestRoute>
        ),
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/policy/:id",
        element: <StandalonePolicyPage />,
    }
]);

export default router;
