"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useBooking, useConfirmBooking, useCancelBooking } from "@/hooks/use-bookings"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES, BookingStatus, PaymentStatus } from "@/lib/constants"
import { formatPrice, formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { data, isLoading } = useBooking(id)
  const confirmBooking = useConfirmBooking()
  const cancelBooking = useCancelBooking()

  if (isLoading) return <PageLoader />

  const booking = data?.data
  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
        <Button onClick={() => router.push(ROUTES.DASHBOARD_BOOKINGS)}>Back to Bookings</Button>
      </div>
    )
  }

  const isClient = user?.id === booking.clientId
  const isAgent = user?.id === booking.agentId
  const hasConfirmed = isClient ? booking.clientConfirmed : booking.agentConfirmed
  const canConfirm = booking.bookingStatus === BookingStatus.CONFIRMED && !hasConfirmed
  const canCancel = booking.bookingStatus === BookingStatus.PENDING || booking.bookingStatus === BookingStatus.CONFIRMED

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Booking Details</CardTitle>
            <div className="flex gap-2">
              <Badge variant={booking.bookingStatus === BookingStatus.COMPLETED ? "default" : "secondary"}>
                {booking.bookingStatus}
              </Badge>
              <Badge variant={booking.paymentStatus === PaymentStatus.PAID ? "default" : "secondary"}>
                {booking.paymentStatus}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Reference</p>
              <p className="font-mono text-sm">{booking.paymentReference}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-bold">{formatPrice(booking.amount)}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{booking.scheduledDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{booking.scheduledTime}</p>
              </div>
            </div>
          </div>

          {booking.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm mt-1">{booking.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div>
            <p className="text-sm font-medium mb-3">Meeting Confirmation</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                {booking.clientConfirmed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                Client {booking.clientConfirmed ? "confirmed" : "not confirmed"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {booking.agentConfirmed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                Agent {booking.agentConfirmed ? "confirmed" : "not confirmed"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p>Created: {formatDate(booking.createdAt)}</p>
            </div>
            {booking.expiresAt && (
              <div>
                <p>Payout after: {formatDate(booking.expiresAt)}</p>
              </div>
            )}
          </div>

          {(canConfirm || canCancel) && (
            <>
              <Separator />
              <div className="flex gap-3">
                {canConfirm && (
                  <Button
                    onClick={() => confirmBooking.mutate(booking.id)}
                    disabled={confirmBooking.isPending}
                    className="gap-2"
                  >
                    {confirmBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    <CheckCircle className="h-4 w-4" />
                    Confirm Meeting
                  </Button>
                )}
                {canCancel && (
                  <Button
                    variant="destructive"
                    onClick={() => cancelBooking.mutate(booking.id)}
                    disabled={cancelBooking.isPending}
                    className="gap-2"
                  >
                    {cancelBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    <XCircle className="h-4 w-4" />
                    Cancel Booking
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
