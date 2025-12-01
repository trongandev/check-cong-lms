import MainContentFull from "@/components/MainContentFull"
import { useOfficeHours } from "@/hook/useOfficeHours"

export default function AdminPage() {
    const { data, isLoading, error } = useOfficeHours("t10-2025", "")
    return <MainContentFull data={data} isLoading={isLoading} error={error} />
}
