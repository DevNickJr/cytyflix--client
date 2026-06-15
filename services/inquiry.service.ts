import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { Inquiry, SendInquiryRequest, UpdateInquiryStatusRequest } from "@/types/inquiry"

export const inquiryService = {
  async sendInquiry(data: SendInquiryRequest) {
    return apiClient.post<ApiResponse<Inquiry>>("/inquiries", data)
  },

  async getSentInquiries(page = 1, limit = 20) {
    return apiClient.get<PaginatedResponse<Inquiry>>("/inquiries/sent", { page, limit })
  },

  async getReceivedInquiries(page = 1, limit = 20) {
    return apiClient.get<PaginatedResponse<Inquiry>>("/inquiries/received", { page, limit })
  },

  async updateInquiryStatus(id: string, data: UpdateInquiryStatusRequest) {
    return apiClient.patch<ApiResponse<Inquiry>>(`/inquiries/${id}/status`, data)
  },
}
