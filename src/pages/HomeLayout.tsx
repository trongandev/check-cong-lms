import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
    return (
        <>
            <Header />
            <div className="min-h-[90vh]  px-5 py-3 dark:bg-gray-800/90">
                <Outlet />
            </div>

            <Footer />
        </>
    );
}
