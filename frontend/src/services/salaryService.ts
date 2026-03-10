import axiosInstance from "@/services/axiosInstance"
import { APIResponse, OfficeHourResponse, SalaryAllResponse } from "@/types/type"

class SalaryService {
    async getSalaryByUser({ date }: { date?: string }) {
        const response = await axiosInstance.get<APIResponse<OfficeHourResponse>>(`/salary${date ? `?date=${date}` : ""}`)
        return response.data.data
    }

    async getAllSalary() {
        const response = await axiosInstance.get<APIResponse<SalaryAllResponse[]>>(`/salary/all`)
        return response.data.data
    }
}

export default new SalaryService()
