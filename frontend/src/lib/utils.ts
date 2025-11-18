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

    if (status === "CHECKED") {
        switch (role) {
            case "LEC":
            case "Judge":
            case "Supply":
                acc += salary * 1000 * 2
                break
            case "TA":
            case "Makeup":
                acc += salary * 1000 * 1.5
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

export const NOTE = {
    LEC: "Dạy chính",
    TA: "Trợ giảng",
    TRIAL: "Tính công trực 1 tiếng ( = online = 80k/hr)",
    FIXED: "3 tiếng trực offline",
    OFFICE_HOURS: "Công trực",
    MAKEUP: "Dạy bù",
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
