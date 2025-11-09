import MainContentFull from "@/components/MainContentFull"
import { useOfficeHours } from "@/hook/useOfficeHours"

export default function Thang8() {
    const { data, isLoading, error } = useOfficeHours("t9-2025", true)

    return MainContentFull({ data, isLoading, error })
}
