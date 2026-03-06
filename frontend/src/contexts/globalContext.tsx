/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react"

interface GlobalContextType {
    state: Record<string, any>
    setGlobal: (key: string, value: any) => void
    getGlobal: (key: string, defaultValue?: any) => any
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<Record<string, any>>({
        dateTimeKey: "12/2025",
    })

    // Hàm này cho phép bạn cập nhật bất kỳ biến nào bằng key
    const setGlobal = (key: any, value: any) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }))
    }

    // Hàm lấy giá trị với giá trị mặc định (tùy chọn)
    const getGlobal = (key: any, defaultValue: any = null) => {
        return state[key] !== undefined ? state[key] : defaultValue
    }
    return <GlobalContext.Provider value={{ state, setGlobal, getGlobal }}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = () => {
    const context = useContext(GlobalContext)
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider")
    }
    return context
}
