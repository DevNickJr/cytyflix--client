import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { Property, CreatePropertyRequest, UpdatePropertyRequest, PropertyFilters } from "@/types/property"

export const propertyService = {
  async getProperties(filters?: PropertyFilters) {
    const params = filters as Record<string, string | number | boolean | undefined> | undefined
    return apiClient.get<PaginatedResponse<Property>>("/properties", params)
  },

  async getProperty(id: string) {
    return apiClient.get<ApiResponse<Property>>(`/properties/${id}`)
  },

  async createProperty(data: CreatePropertyRequest) {
    return apiClient.post<ApiResponse<Property>>("/properties", data)
  },

  async updateProperty(id: string, data: UpdatePropertyRequest) {
    return apiClient.patch<ApiResponse<Property>>(`/properties/${id}`, data)
  },

  async deleteProperty(id: string) {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/properties/${id}`)
  },

  async getMyProperties(page = 1, limit = 20) {
    return apiClient.get<PaginatedResponse<Property>>("/properties/me", { page, limit })
  },
}
