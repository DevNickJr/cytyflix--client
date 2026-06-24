"use client"

import { useState } from "react"
import { useMyBookings } from "@/hooks/use-bookings"
import { useAuth } from "@/hooks/use-auth"
import { RolesEnum } from "@/lib/constants"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { BookingCard } from "@/components/bookings/booking-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarCheck } from "lucide-react"

export default function BookingsPage() {
  const { user } = useAuth()
  const [role, setRole] = useState<"client" | "agent">("client")
  const [page, setPage] = useState(1)
  const { data, isLoading } = useMyBookings(page, 20, role)

  const isAgent = user?.role === RolesEnum.AGENT

  if (isLoading) return <PageLoader />

  const bookings = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your property tour bookings</p>
      </div>

      {isAgent && (
        <Tabs value={role} onValueChange={(v) => { setRole(v as "client" | "agent"); setPage(1) }}>
          <TabsList>
            <TabsTrigger value="client">As Client</TabsTrigger>
            <TabsTrigger value="agent">As Agent</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings"
          description={role === "client" ? "You haven't booked any agents yet." : "You haven't received any bookings yet."}
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}
    </div>
  )
}
