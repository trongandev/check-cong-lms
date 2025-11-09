import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import useScrollRestoration from "@/hook/useScrollRestoration";

export default function RootLayout() {
    useScrollRestoration();

    return (
        <AuthProvider>
            <Outlet />
            <Toaster />
        </AuthProvider>
    );
}
