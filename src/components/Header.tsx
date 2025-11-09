import { useEffect, useState } from "react";
import logo from "/logo.svg";
import { Calendar, LogOut, Moon, PhoneCall, Sun, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AvatarCircle from "@/components/etc/AvatarCircle";
import { Separator } from "@/components/ui/separator";

export default function Header() {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("dark");
        return savedTheme ? JSON.parse(savedTheme) : false;
    });
    const { user, logout } = useAuth();

    const pathname = useLocation().pathname;
    const navigate = useNavigate();

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

    return (
        <div className="dark:bg-slate-800 bg-white dark:text-white w-full h-13 shadow-md border-b border-gray-200 dark:border-b-white/10  flex items-center justify-center px-5 md:px-0">
            <div className="w-full md:w-[800px] lg:w-[1000px] xl:w-[1200px] flex justify-between items-center">
                <a href="/">
                    <img src={logo} alt="" className="w-20 h-10" />
                </a>
                <div className="flex items-center gap-5">
                    <a href="/" className={`flex items-center gap-1 ${pathname === "/" ? "text-blue-500 font-bold" : ""}`}>
                        <Calendar size={18} /> Công tháng 10
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <button onClick={toggleTheme} className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                    <div className="">
                        {user ? (
                            <div>
                                <div className="hidden md:block">
                                    <span className="text-sm md:text-base text-white mr-3">
                                        Xin chào,{" "}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="font-semibold hover:underline cursor-pointer">
                                                <AvatarCircle user={user} />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => navigate("/profile")}>
                                                    <User /> Thông tin chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate("/help-center")}>
                                                    <PhoneCall /> Trung tâm Trợ giúp
                                                </DropdownMenuItem>
                                                <Separator />
                                                <DropdownMenuItem variant="destructive" className=" cursor-pointer " onClick={() => logout()}>
                                                    <LogOut className="text-destructive" /> Đăng xuất
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </span>
                                </div>
                                <div className="flex items-center  w-10 h-10 justify-center md:hidden bg-gradient-to-tr from-sky-700 to-purple-700 rounded-full text-white">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="font-semibold hover:underline cursor-pointer">
                                            {user.displayName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => navigate("/profile")}>
                                                <User /> Thông tin chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate("/help-center")}>
                                                <PhoneCall /> Trung tâm Trợ giúp
                                            </DropdownMenuItem>
                                            <Separator />
                                            <DropdownMenuItem variant="destructive" className=" cursor-pointer " onClick={() => logout()}>
                                                <LogOut className="text-destructive" /> Đăng xuất
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ) : (
                            <Link to={"/auth/login"}>
                                <Button className="text-xs md:text-sm" variant={"outline"}>
                                    Đăng nhập
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
