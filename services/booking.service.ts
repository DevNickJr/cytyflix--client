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

  async confirmBooking(id: string) {
    return apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/confirm`)
  },

  async cancelBooking(id: string) {
    return apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`)
  },
}
