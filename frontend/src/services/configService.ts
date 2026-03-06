import axiosInstance from "@/services/axiosInstance"
import { APIResponse, ConfigRequest, LinkSheetRequest } from "@/types/type"

class ConfigService {
    async getConfigDefault() {
        const response = await axiosInstance.get<APIResponse<ConfigRequest>>("/config")
        return response.data.data
    }

    async createConfigDefault() {
        const response = await axiosInstance.post<APIResponse<ConfigRequest>>("/config")
        return response.data.data
    }
    async updateLinkSheet(data: LinkSheetRequest) {
        const response = await axiosInstance.patch<APIResponse<LinkSheetRequest>>("/config", data)
        return response.data.data
    }
    async deleteLinkSheet(_id: string) {
        const response = await axiosInstance.delete<APIResponse<ConfigRequest>>("/config/" + _id)
        return response.data.data
    }
}

export default new ConfigService()
