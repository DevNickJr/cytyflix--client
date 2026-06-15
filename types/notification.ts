export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  metadata: Record<string, unknown>
  createdAt: string
}

export interface UnreadCountResponse {
  unreadCount: number
}
