import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { ConfigProvider } from "@/contexts/ConfigContext"
import { Outlet } from "react-router-dom"

export default function HomeLayout() {
    return (
        <ConfigProvider>
            <Header />
            <div className="bg-white/50">
                <Outlet />
            </div>

            <Footer />
        </ConfigProvider>
    )
}
