import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage/Index";
import RegisterPage from "../pages/RegisterPage/Index";
import HomePage from "@/pages/HomePage/Index";
import DashboardPage from "@/pages/DashboardPage/Index";
import ProfilePage from "@/pages/ProfilePage/Index";
import { ConfigRoute } from "./configRoute";
import { usePageView } from "@/hooks/usePageView";

const routesList = [
    { path: "/", element: <HomePage />, isPrivate: true },
    { path: "/dashboard", element: <DashboardPage />, isPrivate: true },
    { path: "/profile", element: <ProfilePage />, isPrivate: true },
    { path: "/login", element: <LoginPage />, isPrivate: false },
    { path: "/register", element: <RegisterPage />, isPrivate: false },
];

export default function RoutesAPP() {
    return (
        <BrowserRouter>
            <PageViewHandler />
            <Routes>
                {routesList.map(({ path, element, isPrivate }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <ConfigRoute isPrivate={isPrivate}>
                                {element}
                            </ConfigRoute>
                        }
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

function PageViewHandler() {
    usePageView();
    return null;
}
