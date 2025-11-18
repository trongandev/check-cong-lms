import { useState, useEffect } from "react"
import Papa from "papaparse"
import { OfficeHour } from "@/types/type"

interface ParseResult {
    data: OfficeHour[]
    errors: Papa.ParseError[]
    meta: Papa.ParseMeta
}

export const useOfficeHours = (file_name: string, username: string, is_save: boolean) => {
    const [data, setData] = useState<OfficeHour[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Kiểm tra cache trong sessionStorage
                const cachedData = sessionStorage.getItem(file_name)
                if (cachedData && is_save) {
                    const parsed = JSON.parse(cachedData) as OfficeHour[]
                    setData(parsed)
                    setIsLoading(false)
                    return
                }

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
                        if (is_save) {
                            try {
                                const filterUsername = parsedData?.filter((item: OfficeHour) => item.Username === username)
                                console.log(filterUsername)
                                sessionStorage.setItem(file_name, JSON.stringify(filterUsername))
                            } catch (e) {
                                console.warn("Failed to save to sessionStorage:", e)
                            }
                        }
                        setData(parsedData)
                        setIsLoading(false)
                    },
                    transform: (value: string) => {
                        return value.trim() // Clean up whitespace
                    },
                })
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
                setError(errorMessage)
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    return { data, isLoading, error } as const
}
