import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../layout/dashboard";
import AuthLayout from "../layout/auth";
import Loader from "../layout/loading";

const Loadable = (Component) => (props) => {
    return (
        <Suspense fallback={<Loader />}>
            <Component {...props} />
        </Suspense>
    );
}

export default function Router() {
    return useRoutes([
        {
            path: "/",
            element: <DashboardLayout />,
            children: [
                // { element: <Navigate to={"/marketplace"} replace />, index: true },
                { path: "marketplace", element: <MarketPlace /> },
                { path: "settings", element: <SettingsPage /> },
                { path: "listing", element: <></> },
                { path: "conversations", element: <ConversationsPage /> },
                { path: "profile", element: <ProfilePage /> },
            ],
        },
        { path: "*", element: <></> },
    ]);
}

const MarketPlace = Loadable(lazy(() => import("../pages/marketplace/Marketplace")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const SettingsPage = Loadable(lazy(() => import("../pages/settings/Settings")));
const ConversationsPage = Loadable(lazy(() => import("../pages/conversations/Conversations")));
const ProfilePage = Loadable(lazy(() => import("../pages/profile/Profile")));