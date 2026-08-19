import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import OfficialVerification from "./features/auth/pages/OfficialVerification";
import OrganizationVerification from "./features/auth/pages/OrganizationVerification";
import Dashboard from "./pages/Dashboard/Dashboard";
import StandalonePolicyPage from "./pages/Policies/StandalonePolicyPage";
import StandaloneSchemePage from "./pages/Schemes/StandaloneSchemePage";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
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
        path: "/official-verification",
        element: <OfficialVerification />,
    },
    {
        path: "/organization-verification",
        element: <OrganizationVerification />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/policy/:id",
        element: <StandalonePolicyPage />,
    },
    {
        path: "/scheme/:id",
        element: <StandaloneSchemePage />,
    },
    {
        path: "/forgot-password",
        element: (
            <GuestRoute>
                <ForgotPassword />
            </GuestRoute>
        ),
    },
    {
        path: "/reset-password/:token",
        element: (
            <GuestRoute>
                <ResetPassword />
            </GuestRoute>
        ),
    }
]);

export default router;
