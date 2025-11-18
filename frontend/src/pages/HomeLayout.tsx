import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Outlet } from "react-router-dom"

export default function HomeLayout() {
    return (
        <>
            <Header />
            <div className="bg-white/50">
                <Outlet />
            </div>

            <Footer />
        </>
    )
}
