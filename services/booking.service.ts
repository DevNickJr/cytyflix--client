import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { Booking, CreateBookingRequest, CreateBookingResponse } from "@/types/booking"

export const bookingService = {
  async createBooking(data: CreateBookingRequest) {
    return apiClient.post<ApiResponse<CreateBookingResponse>>("/bookings", data)
  },

  async getMyBookings(page = 1, limit = 20, role: "client" | "agent" = "client") {
    return apiClient.get<PaginatedResponse<Booking>>("/bookings", { page, limit, role })
  },

  async getBooking(id: string) {
    return apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`)
  },

  async agentConfirmBooking(id: string) {
    return apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/agent-confirm`)
  },

  async clientReleaseBooking(id: string) {
    return apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/client-release`)
  },

  async updateBookingSchedule(id: string, data: { scheduledDate?: string; scheduledTime?: string }) {
    return apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}`, data)
  },

  async rejectBooking(id: string) {
    return apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/reject`)
  },

  async cancelBooking(id: string) {
    return apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`)
  },
}
