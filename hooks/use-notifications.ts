"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { notificationService } from "@/services/notification.service"

export function useNotifications(page = 1, limit = 20) {
  return useFetch({
    queryKey: ["notifications", page, limit],
    queryFn: () => notificationService.getNotifications(page, limit),
  })
}

export function useUnreadCount() {
  return useFetch({
    queryKey: ["unread-count"],
    queryFn: () => notificationService.getUnreadCount(),
    options: { refetchInterval: 30000 }
  })
}

export function useMarkAsRead() {
  return useMutationAction(
    (id: string) => notificationService.markAsRead(id),
    {
      invalidateKeys: [["notifications"], ["unread-count"]],
    }
  )
}

export function useMarkAllAsRead() {
  return useMutationAction(
    () => notificationService.markAllAsRead(),
    {
      successMessage: "All notifications marked as read",
      invalidateKeys: [["notifications"], ["unread-count"]],
    }
  )
}
