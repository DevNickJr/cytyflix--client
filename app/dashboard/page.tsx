"use client"

import { useAuth } from "@/hooks/use-auth"
import { useMyProperties } from "@/hooks/use-properties"
import { useSentInquiries, useReceivedInquiries } from "@/hooks/use-inquiries"
import { useNotifications, useUnreadCount } from "@/hooks/use-notifications"
import { useSavedListings } from "@/hooks/use-saved-listings"
import { ROUTES, OWNER_ROLES, ROLE_LABELS } from "@/lib/constants"
import { formatRelativeTime } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Building2,
  Heart,
  MessageSquare,
  Bell,
  ArrowRight,
  User,
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const isOwner = user && OWNER_ROLES.includes(user.role)
  const { data: propertiesData } = useMyProperties(1, 5)
  const { data: savedData } = useSavedListings(1, 5)
  const { data: sentData } = useSentInquiries(1, 5)
  const { data: receivedData } = useReceivedInquiries(1, 5)
  const { data: notifData } = useNotifications(1, 5)
  const { data: unreadData } = useUnreadCount()

  const stats = [
    ...(isOwner
      ? [{ label: "My Properties", value: propertiesData?.total ?? 0, icon: Building2, href: ROUTES.DASHBOARD_MY_PROPERTIES }]
      : []),
    { label: "Saved Listings", value: savedData?.total ?? 0, icon: Heart, href: ROUTES.DASHBOARD_SAVED },
    { label: "Inquiries Sent", value: sentData?.total ?? 0, icon: MessageSquare, href: ROUTES.DASHBOARD_INQUIRIES },
    ...(isOwner
      ? [{ label: "Inquiries Received", value: receivedData?.total ?? 0, icon: MessageSquare, href: ROUTES.DASHBOARD_INQUIRIES }]
      : []),
    { label: "Unread Notifications", value: unreadData?.data?.unreadCount ?? 0, icon: Bell, href: ROUTES.DASHBOARD_NOTIFICATIONS },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.profile?.firstName || user?.email}
          {user?.role && (
            <Badge variant="outline" className="ml-2">
              {ROLE_LABELS[user.role]}
            </Badge>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <stat.icon className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Notifications</CardTitle>
            <Link href={ROUTES.DASHBOARD_NOTIFICATIONS} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}>
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {notifData?.data && notifData.data.length > 0 ? (
              <div className="space-y-3">
                {notifData.data.slice(0, 4).map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3 text-sm">
                    <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${notif.isRead ? "text-muted-foreground" : "text-primary"}`} />
                    <div className="min-w-0">
                      <p className={`line-clamp-1 ${notif.isRead ? "text-muted-foreground" : "font-medium"}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(notif.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No notifications yet</p>
            )}
          </CardContent>
        </Card>

        {!user?.profile?.firstName && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add your name and preferences to get a personalized experience.
              </p>
              <Link href={ROUTES.DASHBOARD_PROFILE} className={cn(buttonVariants({ size: "sm" }), "gap-2")}>
                <User className="h-4 w-4" />
                Update Profile
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
