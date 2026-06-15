import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { User, UpdateProfileRequest } from "@/types/user"

export const userService = {
  async getMe() {
    return apiClient.get<ApiResponse<User>>("/users/me")
  },

  async updateProfile(data: UpdateProfileRequest) {
    return apiClient.put<ApiResponse<User>>("/users/me", data)
  },

  async getUserById(id: string) {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`)
  },
}
