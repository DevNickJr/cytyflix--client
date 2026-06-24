import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { Report, CreateReportRequest, ReviewReportRequest } from "@/types/report"

export const reportService = {
  async createReport(propertyId: string, data: CreateReportRequest) {
    return apiClient.post<ApiResponse<Report>>(`/properties/${propertyId}/reports`, data)
  },

  async getReports(page = 1, limit = 20, status?: string) {
    const params: Record<string, string | number> = { page, limit }
    if (status) params.status = status
    return apiClient.get<PaginatedResponse<Report>>("/reports", params)
  },

  async reviewReport(id: string, data: ReviewReportRequest) {
    return apiClient.patch<ApiResponse<Report>>(`/reports/${id}`, data)
  },
}
