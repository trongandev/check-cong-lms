import { OfficeHour } from "@/types/type"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Papa from "papaparse"

interface ParseResult {
    data: OfficeHour[]
    errors: Papa.ParseError[]
    meta: Papa.ParseMeta
}
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getTotalSalary = (data: OfficeHour, salary: number) => {
    let acc = 0
    const status = data["Status"] as string
    const role = data["Class role/Office hour type"] as string
    const studentCount = data["Student count"] ? parseInt(data["Student count"]) : 0
    const slotDuration = data["Slot duration"] ? parseInt(data["Slot duration"]) : 0

    if (status === "CHECKED") {
        switch (role) {
            case "LEC":
            case "Judge":
            case "Supply":
                acc += salary * 1000 * 2
                break
            case "TA":
                acc += (salary * 1000 * 2 * 75) / 100
                break
            case "Makeup":
                acc += studentCount > 3 ? salary * 1000 * 2 : (salary * 1000 * slotDuration * 75) / 100
                break
            case "Fixed":
                acc += studentCount < 1 ? 100000 : 80000 + 30000 * studentCount
                break
            case "Trial":
                acc += studentCount <= 1 ? 40000 : 20000 + 20000 * studentCount
                break
            default:
                break
        }
    }
    return acc
}

export const getTime = (data: OfficeHour) => {
    let acc = 0
    const status = data["Status"] as string
    const role = data["Class role/Office hour type"] as string

    if (status === "CHECKED") {
        switch (role) {
            case "LEC":
            case "Judge":
            case "Supply":
                acc += 2
                break
            case "TA":
                acc += 2
                break
            case "Makeup":
                acc += 1
                break
            case "Fixed":
                acc += 3
                break
            case "Trial":
                acc += 1
                break
            default:
                break
        }
    }
    return acc
}

export const NOTE = {
    LEC: "Dạy chính",
    TA: "Trợ giảng",
    TRIAL: "Tính công trực 1 tiếng ( = online = 80k/hr)",
    FIXED: "3 tiếng trực offline",
    OFFICE_HOURS: "Công trực",
    MAKEUP: "Dạy bù ( = 75% lương chính)",
    SUPPLY: "Dạy thay",
}

export const readCSVAndFilterAndSaveSessionStorage = async (file_name: string, username: string) => {
    let data = [] as OfficeHour[]
    const response = await fetch(`/${file_name}.csv`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const csvText = await response.text()
    Papa.parse<OfficeHour>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult) => {
            if (results.errors.length > 0) {
                console.warn("CSV parsing warnings:", results.errors)
            }
            const parsedData = results.data
            const filterUsername = parsedData?.filter((item: OfficeHour) => item.Username === username)
            data = filterUsername
        },
        transform: (value: string) => {
            return value.trim() // Clean up whitespace
        },
    })
    return data
}

export const readCSVAndFilterAndCalcSalary = async (username: string, salary: number) => {
    const dataSalary = ["t1-2025", "t2-2025", "t3-2025", "t4-2025", "t5-2025", "t6-2025", "t7-2025", "t8-2025", "t9-2025", "t10-2025"]
    let totalSalary = 0
    let time = 0

    const salaryPromises = dataSalary.map(async (month) => {
        const response = await fetch(`/${month}.csv`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const csvText = await response.text()

        return new Promise<number>((resolve) => {
            Papa.parse<OfficeHour>(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results: ParseResult) => {
                    if (results.errors.length > 0) {
                        console.warn("CSV parsing warnings:", results.errors)
                    }
                    const parsedData = results.data
                    const filterUsername = parsedData?.filter((item: OfficeHour) => item.Username === username)

                    const monthlySalary = filterUsername.reduce((acc, item) => {
                        return acc + getTotalSalary(item, salary) // assuming salary is 40k
                    }, 0)
                    const totalTime = filterUsername.reduce((acc, item) => {
                        return acc + getTime(item)
                    }, 0)
                    time += totalTime

                    resolve(monthlySalary)
                },
                transform: (value: string) => {
                    return value.trim()
                },
            })
        })
    })

    const salaries = await Promise.all(salaryPromises)
    totalSalary = salaries.reduce((acc, salary) => acc + salary, 0)

    return { totalSalary, time }
}
