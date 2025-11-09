import axiosInstance from "@/services/axiosInstance";
import { APIResponse } from "@/types/type";
import type { User } from "@/types/user";

class ProfileService {
    async getProfile() {
        const response = await axiosInstance.get<APIResponse<User>>("/profile");
        return response.data.data;
    }

    async getProfileById(userId: string) {
        const response = await axiosInstance.get<APIResponse<User>>(`/profile/${userId}`);
        return response.data.data;
    }

    async updateProfile(userId: string, data: Partial<User>) {
        const response = await axiosInstance.patch<APIResponse<User>>(`/profile/${userId}`, data);
        return response.data.data;
    }
}

export default new ProfileService();
