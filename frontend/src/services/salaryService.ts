import axiosInstance from "@/services/axiosInstance"
import { APIResponse, SalaryResponse } from "@/types/type"

class SalaryService {
    async getSalaryByUser() {
        const response = await axiosInstance.get<APIResponse<SalaryResponse>>("/salary")
        return response.data.data
    }
}

export default new SalaryService()
