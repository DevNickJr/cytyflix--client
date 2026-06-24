import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { AgentVerification, SubmitVerificationRequest, ReviewVerificationRequest } from "@/types/agent-verification"

export const agentVerificationService = {
  async submit(data: SubmitVerificationRequest) {
    return apiClient.post<ApiResponse<AgentVerification>>("/agent-verifications", data)
  },

  async getMyVerification() {
    return apiClient.get<ApiResponse<AgentVerification | null>>("/agent-verifications/me")
  },

  async getAll(page = 1, limit = 20, status?: string) {
    const params: Record<string, string | number> = { page, limit }
    if (status) params.status = status
    return apiClient.get<PaginatedResponse<AgentVerification>>("/agent-verifications", params)
  },

  async getOne(id: string) {
    return apiClient.get<ApiResponse<AgentVerification>>(`/agent-verifications/${id}`)
  },

  async review(id: string, data: ReviewVerificationRequest) {
    return apiClient.patch<ApiResponse<AgentVerification>>(`/agent-verifications/${id}/review`, data)
  },
}
