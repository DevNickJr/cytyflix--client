import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { Notification, UnreadCountResponse } from "@/types/notification"

export const notificationService = {
  async getNotifications(page = 1, limit = 20) {
    return apiClient.get<PaginatedResponse<Notification>>("/notifications", { page, limit })
  },

  async getUnreadCount() {
    return apiClient.get<ApiResponse<UnreadCountResponse>>("/notifications/unread-count")
  },

  async markAsRead(id: string) {
    return apiClient.patch<ApiResponse<{ message: string }>>(`/notifications/${id}/read`)
  },

  async markAllAsRead() {
    return apiClient.patch<ApiResponse<{ message: string }>>("/notifications/read-all")
  },
}
