import axiosInstance from "@/services/axiosInstance"
import { APIResponse, OfficeHourResponse } from "@/types/type"

class OfficeHoursService {
    async getAll({ dateTimeKey }: { dateTimeKey?: string }) {
        const response = await axiosInstance.get<APIResponse<any>>(`/oh?date=${dateTimeKey || ""}`)
        return response.data.data
    }
    async getOfficeHoursByUser({ username, date }: { username?: string; date?: string }) {
        const response = await axiosInstance.get<APIResponse<OfficeHourResponse>>(`/oh/username?username=${username || ""}&date=${date || ""}`)
        return response.data.data
    }
}

export default new OfficeHoursService()
