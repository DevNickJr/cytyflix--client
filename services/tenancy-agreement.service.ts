import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type {
  TenancyAgreement,
  CreateAgreementRequest,
  SignAgreementRequest,
} from "@/types/tenancy-agreement"

export const tenancyAgreementService = {
  async createAgreement(data: CreateAgreementRequest) {
    return apiClient.post<ApiResponse<TenancyAgreement>>("/tenancy-agreements", data)
  },

  async getMyAgreements(page = 1, limit = 20) {
    return apiClient.get<PaginatedResponse<TenancyAgreement>>("/tenancy-agreements", { page, limit })
  },

  async getAgreement(id: string) {
    return apiClient.get<ApiResponse<TenancyAgreement>>(`/tenancy-agreements/${id}`)
  },

  async signAsLandlord(id: string, data: SignAgreementRequest) {
    return apiClient.post<ApiResponse<TenancyAgreement>>(`/tenancy-agreements/${id}/sign-landlord`, data)
  },

  async signAsTenant(id: string, data: SignAgreementRequest) {
    return apiClient.post<ApiResponse<TenancyAgreement>>(`/tenancy-agreements/${id}/sign-tenant`, data)
  },

  getDownloadUrl(id: string) {
    return `/tenancy-agreements/${id}/download`
  },
}
