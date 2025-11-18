import { useAuth } from "@/contexts/AuthContext"
import { OfficeHour } from "@/types/type"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Dot, Globe, User, Users } from "lucide-react"
import { getTotalSalary, NOTE, readCSVAndFilterAndSaveSessionStorage } from "@/lib/utils"
import LoadingScreen from "@/components/etc/LoadingScreen"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function HomePage() {
    const [filterData, setFilterData] = useState<OfficeHour[]>([])
    const [salary, setSalary] = useState(() => {
        const savedSalary = localStorage.getItem("rank-salary")
        return savedSalary ? Number(savedSalary) : 120
    })

    const [check, setCheck] = useState<number>(0)
    const [uncheck, setUncheck] = useState<number>(0)
    const [totalSalary, setTotalSalary] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            const data = await readCSVAndFilterAndSaveSessionStorage("t10-2025", user?.username || "")
            setFilterData(data || [])
            setCheck(data.filter((item) => item["Status"] === "CHECKED").length || 0)
            setUncheck(data?.filter((item) => item["Status"] === "UNCHECKED").length || 0)

            setTotalSalary(data?.reduce((acc, item) => acc + (item.salary || 0), 0) || 0)
        }
        if (user) fetchData()
        setLoading(false)
    }, [user, salary])

    useEffect(() => {
        const getTotal = filterData?.map((item) => {
            const total = getTotalSalary(item, salary)
            return {
                ...item,
                salary: total,
            }
        })
        setTotalSalary(getTotal.reduce((acc, item) => acc + (item.salary || 0), 0))
    }, [filterData, salary])
    const handleChangeSalary = (value: string) => {
        localStorage.setItem("rank-salary", value)
        setSalary(Number(value))
    }

    const handleChangeSalaryItem = (value: string, slotTime: string) => {
        const updatedData = filterData.map((item) => {
            if (item["Slot time"] === slotTime) {
                const updatedSalary = getTotalSalary(item, Number(value))
                return {
                    ...item,
                    salary: updatedSalary,
                    customRank: Number(value), // Lưu rank riêng cho item này
                }
            }
            return item
        })
        setFilterData(updatedData)
        // Cập nhật lại tổng lương
        setTotalSalary(updatedData.reduce((acc, item) => acc + (item.salary || 0), 0))
    }

    if (loading) {
        return <LoadingScreen />
    }
    return (
        <div className="max-w-7xl mx-auto py-5 px-2 md:px-0 min-h-screen ">
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-5 text-gray-700">
                <div className="border border-gray-300 rounded-md p-3 md:p-5 bg-gray-200/40 ">
                    <h1 className="">Tổng số công</h1>
                    <p className="text-2xl font-medium text-right">{filterData.length}</p>
                </div>
                <div className="border border-gray-300 rounded-md p-3 md:p-5 bg-gray-200/40">
                    <h1 className="">Công check</h1>
                    <p className="text-2xl font-medium text-right">{check}</p>
                </div>
                <div className="border border-red-300/80 rounded-md p-3 md:p-5 bg-red-50 text-red-900">
                    <h1 className="">Công uncheck</h1>
                    <p className="text-2xl font-medium text-right">{uncheck}</p>
                </div>
                <div className="border border-sky-300/80 rounded-md p-3 md:p-5 bg-sky-50 text-sky-900">
                    <h1 className="">Lương</h1>
                    <div className="flex gap-2 flex-col md:flex-row  justify-between">
                        <Select value={String(salary)} onValueChange={(value) => handleChangeSalary(value)}>
                            <SelectTrigger className="border-sky-300/80 shadow-none rounded-sm h-8 px-2">
                                <SelectValue placeholder="Select Rank" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Rank</SelectLabel>
                                    {Array.from({ length: 21 }).map((_, idx) => {
                                        let salary = 0
                                        if (idx === 2) {
                                            salary = 100
                                        } else if (idx < 2) {
                                            salary = idx * 10 * 2 + 70
                                        } else if (idx === 3) {
                                            salary = 120
                                        } else if (idx === 4) {
                                            salary = 140
                                        } else if (idx > 4) {
                                            salary = idx * 10 + 100
                                        }
                                        return (
                                            <SelectItem key={idx} value={String(salary)} onSelect={() => setSalary(salary)}>
                                                T{idx} {`- ${salary}k/hr`}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <p className="text-2xl font-medium text-right">{totalSalary.toLocaleString()}đ</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 my-10">
                {filterData.map((item, index) => (
                    <div
                        key={index}
                        className={`border ${item.Status === "UNCHECKED" ? "border-red-300 bg-red-200/50 text-red-900" : "border-gray-300 bg-gray-200/50"} p-3 md:p-5 rounded-md space-y-3`}
                    >
                        <div className="flex items-center gap-1">
                            <h1>{item["Centre shortname"]}</h1>
                            <Dot className="text-gray-700" />
                            <h1 className="line-clamp-1">{item["Class name"]}</h1>
                        </div>
                        <Badge className={`border-gray-300 bg-gray-200/50 text-inherit rounded-sm`}>{item["Class role/Office hour type"]}</Badge>
                        <div className="flex items-center justify-between gap-5">
                            <div className="flex items-center gap-5">
                                <p className="flex items-center gap-1">
                                    <Clock size={14} /> {item["Slot duration"]}
                                </p>
                                <p className="flex items-center gap-1">
                                    <Users size={14} /> {item["Student count"]}
                                </p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <Select value={String(item.customRank || salary)} onValueChange={(value) => handleChangeSalaryItem(value, item["Slot time"])}>
                                    <SelectTrigger className="border-gray-400/50 shadow-none rounded-sm h-7 px-2 ">
                                        <SelectValue placeholder="Rank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Rank</SelectLabel>
                                            {Array.from({ length: 21 }).map((_, idx) => {
                                                let sala = 0
                                                if (idx === 2) {
                                                    sala = 100
                                                } else if (idx < 2) {
                                                    sala = idx * 10 * 2 + 70
                                                } else if (idx === 3) {
                                                    sala = 120
                                                } else if (idx === 4) {
                                                    sala = 140
                                                } else if (idx > 4) {
                                                    sala = idx * 10 + 100
                                                }
                                                return (
                                                    <SelectItem key={idx} value={String(sala)}>
                                                        T{idx}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-1">
                                    <p className="text-right text-xl font-medium">{getTotalSalary(item, salary).toLocaleString()}đ</p>
                                </div>
                            </div>
                        </div>
                        <p className="flex items-center gap-1 text-xs">
                            <Globe size={14} /> {item["Slot time"].replace("GMT+0000 (Coordinated Universal Time)", "").replace(":00", "")}
                        </p>
                    </div>
                ))}
                {!user && (
                    <div className="h-[500px] col-span-full flex items-center justify-center flex-col gap-4 text-center">
                        <User size={48} className="text-gray-400" />
                        <div className="">
                            <p className="text-gray-500">Vui lòng đăng nhập để xem công và lương</p>

                            <p className="text-gray-500">Sử dụng tài khoản LMS để đăng nhập</p>
                        </div>

                        <Link to="/auth/login">
                            <Button>Đăng nhập</Button>
                        </Link>
                    </div>
                )}
            </div>
            <div className="space-y-5 bg-gray-100 border border-gray-300 p-4 rounded-lg">
                <h2 className="font-medium text-gray-700 text-xl">Ghi chú</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(NOTE).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200/50 border border-gray-300 rounded text-sm">{key}</kbd>
                            <span className="">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
