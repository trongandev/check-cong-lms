import { RouteObject } from "react-router-dom"

import NotFound from "@/pages/NotFound"
import HomeLayout from "@/pages/HomeLayout"
import RootLayout from "@/pages/RootLayout"
import HomePage from "@/pages/HomePage"
import AuthLayout from "@/pages/AuthLayout"
import RegisterPage from "@/pages/RegisterPage"
import ForgotPasswordPage from "@/pages/ForgotPasswordPage"
import LoginPage from "@/pages/LoginPage"
import AdminPage from "@/pages/AdminPage"
import AllSalaryPage from "@/pages/AllSalaryPage"

const routes: RouteObject[] = [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <HomeLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                    {
                        path: "admin",
                        element: <AdminPage />,
                    },
                    {
                        path: "tat-ca-cong",
                        element: <AllSalaryPage />,
                    },
                ],
            },
            {
                path: "auth",
                element: <AuthLayout />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                    },
                    {
                        path: "forgot-password",
                        element: <ForgotPasswordPage />,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]

export default routes
