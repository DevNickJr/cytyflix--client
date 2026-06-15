import { apiClient, setTokens } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth"
import type { User } from "@/types/user"

export const authService = {
  async register(data: RegisterRequest) {
    return apiClient.post<ApiResponse<User>>("/auth/register", data)
  },

  async login(data: LoginRequest) {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", data)
    if (response.success) {
      setTokens(response.data.accessToken, response.data.refeshToken)
    }
    return response
  },

  async refreshToken(refreshToken: string) {
    return apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/refresh-token",
      { refreshToken }
    )
  },
}
