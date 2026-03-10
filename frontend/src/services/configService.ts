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
    async deleteLinkSheet(sheet: LinkSheetRequest) {
        const response = await axiosInstance.delete<APIResponse<ConfigRequest>>("/config/" + sheet._id, {
            data: sheet,
        })
        return response.data.data
    }

    async reorderConfig(configOrder: { id: string; index: number }[]) {
        const response = await axiosInstance.patch<APIResponse<ConfigRequest>>("/config/reorder", { configOrder })
        return response.data.data
    }
}

export default new ConfigService()
