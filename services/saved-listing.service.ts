import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { SavedListing, SaveStatusResponse } from "@/types/saved-listing"

export const savedListingService = {
  async toggleSave(propertyId: string) {
    return apiClient.post<ApiResponse<SavedListing | { message: string }>>("/saved-listings", { propertyId })
  },

  async getSavedListings(page = 1, limit = 20) {
    return apiClient.get<PaginatedResponse<SavedListing>>("/saved-listings", { page, limit })
  },

  async getSaveStatus(propertyId: string) {
    return apiClient.get<ApiResponse<SaveStatusResponse>>(`/saved-listings/${propertyId}/status`)
  },
}
