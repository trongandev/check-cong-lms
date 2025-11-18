import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import useScrollRestoration from "@/hook/useScrollRestoration"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout() {
    useScrollRestoration()

    return (
        <AuthProvider>
            <TooltipProvider>
                <Outlet />
                <Toaster />
            </TooltipProvider>
        </AuthProvider>
    )
}
