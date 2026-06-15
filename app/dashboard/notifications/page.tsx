"use client"

import { useState } from "react"
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useUnreadCount } from "@/hooks/use-notifications"
import { formatRelativeTime } from "@/lib/utils"
import { Pagination } from "@/components/shared/pagination"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useNotifications(page)
  const { data: unreadData } = useUnreadCount()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  if (isLoading) return <PageLoader />

  const unreadCount = unreadData?.data?.unreadCount ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => markAllAsRead.mutate()}>
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {!data?.data?.length ? (
        <EmptyState icon={Bell} title="No notifications" description="You'll be notified about inquiries, updates, and more." />
      ) : (
        <div className="space-y-2">
          {data.data.map((notif) => (
            <Card
              key={notif.id}
              className={cn("cursor-pointer transition-colors", !notif.isRead && "border-primary/30 bg-primary/5")}
              onClick={() => !notif.isRead && markAsRead.mutate(notif.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Bell className={cn("h-4 w-4 mt-1 shrink-0", notif.isRead ? "text-muted-foreground" : "text-primary")} />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", !notif.isRead && "font-medium")}>{notif.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notif.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          )}
        </div>
      )}
    </div>
  )
}
