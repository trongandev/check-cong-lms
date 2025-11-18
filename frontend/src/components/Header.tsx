import logo from "/logo.svg"
import { Calendar, LogOut, PhoneCall, User } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import AvatarCircle from "@/components/etc/AvatarCircle"
import { Separator } from "@/components/ui/separator"

export default function Header() {
    const { user, logout } = useAuth()

    const pathname = useLocation().pathname
    const navigate = useNavigate()

    return (
        <div className="border-b border-gray-300 shadow">
            <div className="flex justify-between items-center  h-14 max-w-7xl mx-auto px-3 md:px-0 py-2">
                <a href="/">
                    <img src={logo} alt="" className="w-20 h-10" />
                </a>
                <div className="flex items-center gap-5">
                    <a href="/" className={`flex items-center gap-1 ${pathname === "/" ? "text-blue-500 font-bold" : ""}`}>
                        <Calendar size={18} /> Công tháng 10
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <div className="">
                        {user ? (
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
                        ) : (
                            <Link to={"/auth/login"}>
                                <Button className="text-xs md:text-sm">Đăng nhập</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
