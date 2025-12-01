import logo from "/logo.svg"
import { Calendar, LayoutDashboard, LogOut, PhoneCall, User, Users } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import AvatarCircle from "@/components/etc/AvatarCircle"
import { Separator } from "@/components/ui/separator"
import { createElement } from "react"

export default function Header() {
    const { user, logout } = useAuth()

    const pathname = useLocation().pathname
    const navigate = useNavigate()
    const linkData = [
        { name: "Công T10", icon: Calendar, href: "/", target: "_self" },
        { name: "Tất cả công", icon: LayoutDashboard, href: "/tat-ca-cong", target: "_self" },
        { name: "Admin Panel", icon: LayoutDashboard, href: "/admin", target: "_self", role: "admin" },
        { name: "Mentor Biên Hòa", icon: Users, href: "https://mindx-teaching.vercel.app/", target: "_blank" },
    ]
    return (
        <>
            <div className="border-b border-gray-300 shadow">
                <div className="flex justify-between items-center  h-14 max-w-7xl mx-auto px-3 md:px-0 py-2">
                    <a href="/" className="">
                        <img src={logo} alt="" className="w-20 h-10" />
                    </a>
                    <div className=" items-center gap-5 hidden md:flex">
                        {linkData.map((item) => {
                            if (item.role && user?.role !== item.role) {
                                return null
                            }
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    target={item.target}
                                    className={`px-3 py-1.5 flex items-center gap-2 rounded-md hover:bg-gray-100  ${
                                        pathname === item.href ? "bg-gray-200/50 border-2 border-dashed border-gray-200  font-semibold" : ""
                                    }`}
                                >
                                    {createElement(item.icon, { size: 16, className: "text-gray-700" })}
                                    {item.name}
                                </Link>
                            )
                        })}
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
            <div className="fixed bottom-0  z-10 px-3 md:px-0 h-12 w-full bg-gray-100  negative-shadow-md flex md:hidden items-center justify-around">
                {linkData.map((item) => {
                    if (item.role && user?.role !== item.role) return null
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex flex-col items-center justify-center gap-1  h-full hover:text-primary transition-colors border-t-2 ${
                                pathname === item.href ? "text-primary  border-primary font-medium" : "text-gray-500 border-transparent"
                            } `}
                        >
                            {createElement(item.icon, { size: 16 })}
                            <span className="text-xs">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}
