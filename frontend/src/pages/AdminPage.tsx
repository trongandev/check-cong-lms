import MainContentFull from "@/components/MainContentFull"
import officeHoursService from "@/services/officeHoursService"
import { OfficeHour } from "@/types/type"
import { useEffect, useState } from "react"

export default function AdminPage() {
    const [data, setData] = useState<OfficeHour[]>([])
    const [dateTimeKey, setDateTimeKey] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAPI = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const req = await officeHoursService.getAll({})
                setData(req.data)
                setDateTimeKey(req.dateTimeKey)
            } catch (err: any) {
                setError(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAPI()
    }, [])

    return <MainContentFull data={data} isLoading={isLoading} error={error} dateTimeKey={dateTimeKey} />
}
