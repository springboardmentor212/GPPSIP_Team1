import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import OfficialVerification from "./features/auth/pages/OfficialVerification";
import OrganizationVerification from "./features/auth/pages/OrganizationVerification";
import Dashboard from "./pages/Dashboard/Dashboard";
import StandalonePolicyPage from "./pages/Policies/StandalonePolicyPage";
import StandaloneSchemePage from "./pages/Schemes/StandaloneSchemePage";
import NotFoundPage from "./pages/NotFoundPage";
import useAuth from "./hooks/useAuth";

const GuestRoute = ({ children }) => {
    const { user, isInitializing } = useAuth();
    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9]">
                <div className="w-12 h-12 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
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
        path: "*",
        element: <NotFoundPage />,
    }
]);

export default router;
