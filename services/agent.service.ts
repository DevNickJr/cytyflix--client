import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { User } from "@/types/user"

export const agentService = {
  async getAgents(page = 1, limit = 20) {
    return apiClient.get<PaginatedResponse<User>>("/users/agents", { page, limit })
  },

  async getAgent(id: string) {
    return apiClient.get<ApiResponse<User>>(`/users/agents/${id}`)
  },
}
