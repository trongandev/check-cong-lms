import axiosInstance from "@/services/axiosInstance"
import { APIResponse, SalaryResponse } from "@/types/type"

class SalaryService {
    async getSalaryByUser({ date }: { date?: string }) {
        const response = await axiosInstance.get<APIResponse<SalaryResponse>>(`/salary${date ? `?date=${date}` : ""}`)
        return response.data.data
    }
}

export default new SalaryService()
