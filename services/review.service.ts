import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { Review, CreateReviewRequest, UpdateReviewRequest, ReviewSummary } from "@/types/review"

export const reviewService = {
  async getReviews(propertyId: string, page = 1, limit = 20) {
    return apiClient.get<PaginatedResponse<Review>>(`/properties/${propertyId}/reviews`, { page, limit })
  },

  async getSummary(propertyId: string) {
    return apiClient.get<ApiResponse<ReviewSummary>>(`/properties/${propertyId}/reviews/summary`)
  },

  async createReview(propertyId: string, data: CreateReviewRequest) {
    return apiClient.post<ApiResponse<Review>>(`/properties/${propertyId}/reviews`, data)
  },

  async updateReview(propertyId: string, reviewId: string, data: UpdateReviewRequest) {
    return apiClient.patch<ApiResponse<Review>>(`/properties/${propertyId}/reviews/${reviewId}`, data)
  },

  async deleteReview(propertyId: string, reviewId: string) {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/properties/${propertyId}/reviews/${reviewId}`)
  },
}
