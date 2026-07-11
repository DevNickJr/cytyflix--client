import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { RentPayment, CreateRentPaymentRequest, CreateRentPaymentResponse } from "@/types/rent-payment"

export const rentPaymentService = {
  async createRentPayment(data: CreateRentPaymentRequest) {
    return apiClient.post<ApiResponse<CreateRentPaymentResponse>>("/rent-payments", data)
  },

  async getMyRentPayments(page = 1, limit = 20, role: "tenant" | "owner" = "tenant") {
    return apiClient.get<PaginatedResponse<RentPayment>>("/rent-payments", { page, limit, role })
  },

  async getRentPayment(id: string) {
    return apiClient.get<ApiResponse<RentPayment>>(`/rent-payments/${id}`)
  },

  async confirmMoveIn(id: string) {
    return apiClient.post<ApiResponse<RentPayment>>(`/rent-payments/${id}/confirm-move-in`)
  },

  async disputeRentPayment(id: string) {
    return apiClient.post<ApiResponse<RentPayment>>(`/rent-payments/${id}/dispute`)
  },
}
