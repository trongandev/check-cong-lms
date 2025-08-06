import { useEffect, useState } from "react";
import logo from "/logo.svg";
import { Calendar, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
export default function Header() {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("dark");
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    const pathname = useLocation().pathname;

    useEffect(() => {
        // Lưu trạng thái theme vào localStorage
        localStorage.setItem("dark", JSON.stringify(isDark));

        // Cập nhật class dark cho root element
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    // const handleClearCache = () => {
    //     localStorage.removeItem("thang3");
    //     window.location.reload();
    // };

    return (
        <div className="dark:bg-slate-800 bg-white dark:text-white w-full h-13 shadow-md border-b border-gray-200 dark:border-b-white/10  flex items-center justify-center px-5 md:px-0">
            <div className="w-full md:w-[800px] lg:w-[1000px] xl:w-[1200px] flex justify-between items-center">
                <a href="/">
                    <img src={logo} alt="" className="w-20 h-10" />
                </a>
                <div className="flex items-center gap-5">
                    <a href="/" className={`flex items-center gap-1 ${pathname === "/" ? "text-blue-500 font-bold" : ""}`}>
                        <Calendar size={18} /> Công tháng 7
                    </a>
                    {/* <a href="/" className={`flex items-center gap-1 ${pathname === "/" ? "text-blue-500 font-bold" : ""}`}>
                        <Calendar size={18} /> Công tháng 6
                    </a> */}
                    {/* <a href="/thang4" className={`flex items-center gap-1 ${pathname === "/thang4" ? "text-blue-500 font-bold" : ""}`}>
                        <Calendar size={18} /> Công tháng 4
                    </a>
                    <a href="/thang3" className={`flex items-center gap-1 ${pathname === "/thang3" ? "text-blue-500 font-bold" : ""}`}>
                        <Calendar size={18} /> Công tháng 3
                    </a>
                    <a href="/thang2" className={`flex items-center gap-1 ${pathname === "/thang2" ? "text-blue-500 font-bold" : ""}`}>
                        <Calendar size={18} /> Công tháng 2
                    </a> */}
                </div>
                <div className="flex items-center gap-3">
                    {/* <div className="">
                        <Button onClick={handleClearCache}>
                            <CloudDownload />
                            Cập nhật dữ liệu mới
                        </Button>
                    </div> */}
                    <div className="flex items-center gap-1">
                        <button onClick={toggleTheme} className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
