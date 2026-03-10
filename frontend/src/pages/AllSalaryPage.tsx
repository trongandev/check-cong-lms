import { useAuth } from "@/contexts/AuthContext"
import { LinkSheetRequest, OfficeHour, SalaryAllResponse } from "@/types/type"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Banknote, BicepsFlexed, Calendar, Clock, Crown, Dot, Globe, User, Users } from "lucide-react"
import { getTotalSalary, NOTE } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import LoadingIcon from "@/components/ui/loading-icon"
import configService from "@/services/configService"
import officeHoursService from "@/services/officeHoursService"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import salaryService from "@/services/salaryService"

export default function AllSalaryPage() {
    const [filterData, setFilterData] = useState<OfficeHour[]>([])
    const [allSalary, setAllSalary] = useState<SalaryAllResponse[]>([])
    const [configData, setConfigData] = useState<LinkSheetRequest[]>([])
    const [selectedConfig, setSelectedConfig] = useState<string>("")

    const [salary, setSalary] = useState(() => {
        const savedSalary = localStorage.getItem("rank-salary")
        return savedSalary ? Number(savedSalary) : 120
    })
    const [totalSalary, setTotalSalary] = useState<number>(0)
    const [stateDataSalary, setStateDataSalary] = useState({
        totalCheck: 0,
        totalUncheck: 0,
        totalTime: 0,
    })
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState<string>("")
    const { user } = useAuth()
    useEffect(() => {
        if (user && user.username) {
            setUsername(user.username)
        }
    }, [user])
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const [data, allSalary, configData] = await Promise.all([
                officeHoursService.getOfficeHoursByUser({ username: user?.username, date: selectedConfig }),
                salaryService.getAllSalary(),
                configService.getConfigDefault(),
            ])
            console.log(allSalary)
            setAllSalary(allSalary)
            setConfigData(configData.linkSheet)
            setSelectedConfig(data.dateTimeKey)
            const getTotal = data.data.map((item) => {
                const total = getTotalSalary(item, salary)
                return {
                    ...item,
                    salary: total,
                }
            })

            setFilterData(getTotal || [])
            const totalCheck = getTotal.filter((item) => item["Status"] === "CHECKED").length || 0
            const totalUncheck = getTotal.filter((item) => item["Status"] === "UNCHECKED").length || 0
            const totalTime = getTotal.reduce((acc, item) => acc + (Number(item["Slot duration"]) ? 2 : 0), 0) || 0
            setStateDataSalary({
                totalCheck: totalCheck,
                totalUncheck: totalUncheck,
                totalTime: totalTime,
            })

            setTotalSalary(getTotal?.reduce((acc, item) => acc + (item.salary || 0), 0) || 0)
            setLoading(false)
        }
        if (user) fetchData()
    }, [user, salary])

    useEffect(() => {
        if (!user) return
        const fetchAPI = async () => {
            const data = await officeHoursService.getOfficeHoursByUser({ username, date: selectedConfig })
            console.log(data)
            const getTotal = data.data.map((item) => {
                const total = getTotalSalary(item as any, salary)
                return {
                    ...item,
                    salary: total,
                }
            })
            const totalCheck = getTotal.filter((item) => item["Status"] === "CHECKED").length || 0
            const totalUncheck = getTotal.filter((item) => item["Status"] === "UNCHECKED").length || 0
            const totalTime = getTotal.reduce((acc, item) => acc + (Number(item["Slot duration"]) ? 2 : 0), 0) || 0
            setFilterData((getTotal as any) || [])
            setStateDataSalary({
                totalCheck: totalCheck,
                totalUncheck: totalUncheck,
                totalTime: totalTime,
            })

            setTotalSalary(getTotal?.reduce((acc, item) => acc + (item.salary || 0), 0) || 0)
        }
        fetchAPI()
    }, [user, username, selectedConfig])

    const handleChangeSalary = (value: string) => {
        localStorage.setItem("rank-salary", value)
        setSalary(Number(value))
    }
    const handleChangeSalaryItem = (value: string, index: number) => {
        const updatedData = filterData.map((dataItem, idx) => {
            if (index === idx) {
                const updatedSalary = getTotalSalary(dataItem, Number(value))
                return {
                    ...dataItem,
                    salary: updatedSalary,
                }
            }
            return dataItem
        })
        // Cập nhật lại tổng lương
        setFilterData(updatedData)
        setTotalSalary(updatedData.reduce((acc, item) => acc + (item.salary || 0), 0))
    }

    return (
        <div className="max-w-7xl mx-auto p-5  min-h-screen ">
            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">Tất cả Công</TabsTrigger>
                    <TabsTrigger value="detail">Chi tiết công</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 text-gray-700 mb-10">
                        {allSalary.map((item) => (
                            <div className="border cursor-pointer border-gray-300 rounded-md p-3 md:p-5 hover:bg-gray-50 bg-gray-50/50 hover:border-gray-400 text-gray-800">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-600" />
                                    <p className="font-medium">{item.dateTimeKey}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-600" /> <p className="">{item.totalTime}h</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BicepsFlexed size={16} className="text-gray-600" /> <p className="">{item.totalCheck + item.totalUncheck} công</p>
                                </div>
                                <div className="flex items-center gap-2 text-red-700">
                                    <Banknote size={16} className="" /> <p className="">{item.totalSalary.toLocaleString()}đ</p>
                                </div>
                                <div className="flex items-center gap-2 text-yellow-700">
                                    <Crown size={16} className="" /> <p className="">Rank: {item.rankSalary}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="detail">
                    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 text-gray-700">
                        <div className="border border-gray-300 rounded-md p-3 md:p-5 bg-gray-50/50 ">
                            <h1 className="">Lựa chọn tháng</h1>
                            <Select value={selectedConfig} onValueChange={(value) => setSelectedConfig(value)}>
                                <SelectTrigger className="border-gray-300/80 shadow-none rounded-sm h-8 w-full px-3">
                                    <SelectValue placeholder="Select Rank" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Tháng</SelectLabel>
                                        {configData.map((config, idx) => {
                                            return (
                                                <SelectItem key={idx} value={config.month}>
                                                    Tháng {config.month}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="border border-gray-300 rounded-md p-3 md:p-5 bg-gray-50/50 ">
                            <h1 className="">Tổng giờ cống hiến trong tháng</h1>

                            <p className="text-2xl font-medium text-right">{stateDataSalary.totalTime} giờ</p>
                        </div>
                        <div className="col-span-2 md:col-span-1 border border-gray-300 rounded-md p-3 md:p-5 bg-gray-50/50 ">
                            <div className="flex items-center justify-between">
                                <h1 className="">Tổng số công:</h1>
                            </div>
                            <div className={`flex items-center ${user?.role === "admin" ? "justify-between" : "justify-end"}  gap-5 mt-1`}>
                                {user?.role === "admin" && <Input type="text" placeholder="Nhập username" className="h-8" value={username} onChange={(e) => setUsername(e.target.value)} />}

                                <p className="text-2xl font-medium text-right">{filterData.length}</p>
                            </div>
                        </div>

                        <div className="col-span-2  md:col-span-1 border border-sky-300/80 rounded-md p-3 md:p-5 bg-sky-50/50 text-sky-900">
                            <h1 className="">Lương {selectedConfig.toUpperCase()}</h1>
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
                                <p className="text-2xl font-medium text-right">{Math.round(totalSalary).toLocaleString()}đ</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 my-10">
                        {!loading &&
                            filterData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`border ${item.Status === "UNCHECKED" ? "border-red-300 bg-red-200/50 text-red-900" : "border-gray-300 bg-gray-50"} p-3 md:p-5 rounded-md space-y-3`}
                                >
                                    <div className="flex items-center gap-1">
                                        <h1>{item["Centre shortname"]}</h1>
                                        <Dot className="text-gray-700" />
                                        <h1 className="line-clamp-1">{item["Class name"] === "undefined" ? item["Type"] : item["Class name"]}</h1>
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
                                            {item["Type"] !== "OFFICE_HOURS" && item["Class role/Office hour type"] !== "TA" && (
                                                <Select value={String(item.salary / 1000 / 2)} onValueChange={(value) => handleChangeSalaryItem(value, index)}>
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
                                            )}
                                            <div className="flex items-center gap-1">
                                                <p className="text-right text-xl font-medium">{Math.round(item.salary).toLocaleString()}đ</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="flex items-center gap-1 text-xs">
                                        <Globe size={14} /> {item["Slot time"].replace("GMT+0000 (Coordinated Universal Time)", "").replace(":00", "")}
                                    </p>
                                </div>
                            ))}
                        {loading && (
                            <div className="h-[500px] flex items-center justify-center col-span-full">
                                <LoadingIcon />
                            </div>
                        )}
                        {filterData.length === 0 && (
                            <div className="h-[500px] flex flex-col gap-5 items-center justify-center col-span-full">
                                <p>Không có dữ liệu để hiển thị trong tháng này</p>
                                <p>Vui lòng chọn tháng khác</p>
                                <Link to={"https://www.facebook.com/trongandev"} target="_blank">
                                    <Button>Liên hệ với Admin để khắc phục lỗi này</Button>
                                </Link>
                            </div>
                        )}
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
                    </div>{" "}
                </TabsContent>
            </Tabs>

            <div className="space-y-5 bg-gray-50/50 border border-gray-300 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                    <h2 className="font-medium text-gray-700 text-xl">Ghi chú</h2>
                    <a
                        className="text-blue-600 underline"
                        target="_blank"
                        href="https://huyvvq.gitbook.io/mindxteaching-thong-tin-giao-vien-can-nam/co-che-luong-thuong/co-che-tinh-luong/chi-tiet-luong"
                    >
                        Xem chi tiết cách tính lương của MindX
                    </a>
                </div>
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
