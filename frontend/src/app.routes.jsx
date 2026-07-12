import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    }
]);

export default router;
