import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { User } from "@/types/user"
import type { Property } from "@/types/property"
import type { AgentFilters, AgentStats } from "@/types/agent"

export const agentService = {
  async getAgents(filters: AgentFilters) {
    const params = filters as Record<string, string | number | boolean | undefined> | undefined
    return apiClient.get<PaginatedResponse<User>>("/users/agents", params)
  },

  async getAgent(id: string) {
    return apiClient.get<ApiResponse<User>>(`/users/agents/${id}`)
  },

  async getAgentBySlug(slug: string) {
    return apiClient.get<ApiResponse<User>>(`/users/agents/by-slug/${slug}`)
  },

  async getAgentProperties(id: string, page = 1, limit = 12) {
    return apiClient.get<PaginatedResponse<Property>>(`/users/agents/${id}/properties`, { page, limit })
  },

  async getAgentStats(id: string) {
    return apiClient.get<ApiResponse<AgentStats>>(`/analytics/agents/${id}/stats`)
  },
}
