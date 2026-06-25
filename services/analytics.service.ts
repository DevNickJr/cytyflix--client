import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { TrackEventRequest, PropertyViewCount, PopularProperty } from "@/types/analytics"

export const analyticsService = {
  async trackEvent(data: TrackEventRequest) {
    return apiClient.post<ApiResponse<null>>("/analytics/events", data)
  },

  async getPropertyViews(propertyId: string) {
    return apiClient.get<ApiResponse<PropertyViewCount>>(`/analytics/properties/${propertyId}/views`)
  },

  async getPopularProperties(limit = 10, days = 30) {
    return apiClient.get<ApiResponse<PopularProperty[]>>("/analytics/popular", { limit, days })
  },
}
