"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import {
  useBooking,
  useAgentConfirmBooking,
  useClientReleaseBooking,
  useUpdateBookingSchedule,
  useRejectBooking,
  useCancelBooking,
} from "@/hooks/use-bookings"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES, BookingStatus, PaymentStatus } from "@/lib/constants"
import { API_URL } from "@/lib/constants"
import { formatPrice, formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Pencil,
  Wallet,
  Download,
} from "lucide-react"

const STATUS_LABEL: Record<string, string> = {
  [BookingStatus.PENDING]: "Pending Payment",
  [BookingStatus.AWAITING_AGENT_CONFIRMATION]: "Awaiting Agent Confirmation",
  [BookingStatus.CONFIRMED]: "Confirmed",
  [BookingStatus.COMPLETED]: "Completed",
  [BookingStatus.DISPUTED]: "Disputed",
  [BookingStatus.CANCELLED]: "Cancelled",
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [BookingStatus.PENDING]: "secondary",
  [BookingStatus.AWAITING_AGENT_CONFIRMATION]: "outline",
  [BookingStatus.CONFIRMED]: "default",
  [BookingStatus.COMPLETED]: "default",
  [BookingStatus.DISPUTED]: "destructive",
  [BookingStatus.CANCELLED]: "destructive",
}

function buildGoogleCalendarLink(booking: { paymentReference: string; scheduledDate: string; scheduledTime: string }) {
  const start = new Date(booking.scheduledDate)
  const timeParts = booking.scheduledTime.match(/^(\d{1,2}):(\d{2})/)
  if (timeParts) {
    start.setHours(parseInt(timeParts[1], 10), parseInt(timeParts[2], 10), 0, 0)
  }
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `CytyFlix Booking - ${booking.paymentReference}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Property inspection booking. Reference: ${booking.paymentReference}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function buildOutlookCalendarLink(booking: { paymentReference: string; scheduledDate: string; scheduledTime: string }) {
  const start = new Date(booking.scheduledDate)
  const timeParts = booking.scheduledTime.match(/^(\d{1,2}):(\d{2})/)
  if (timeParts) {
    start.setHours(parseInt(timeParts[1], 10), parseInt(timeParts[2], 10), 0, 0)
  }
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: `CytyFlix Booking - ${booking.paymentReference}`,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: `Property inspection booking. Reference: ${booking.paymentReference}`,
  })
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { data, isLoading } = useBooking(id)
  const agentConfirm = useAgentConfirmBooking()
  const clientRelease = useClientReleaseBooking()
  const updateSchedule = useUpdateBookingSchedule()
  const rejectBooking = useRejectBooking()
  const cancelBooking = useCancelBooking()

  const [editingSchedule, setEditingSchedule] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")

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

  const isAwaiting = booking.bookingStatus === BookingStatus.AWAITING_AGENT_CONFIRMATION
  const isConfirmed = booking.bookingStatus === BookingStatus.CONFIRMED
  const isCompleted = booking.bookingStatus === BookingStatus.COMPLETED
  const isCancelled = booking.bookingStatus === BookingStatus.CANCELLED
  const isDisputed = booking.bookingStatus === BookingStatus.DISPUTED

  // Auto-release countdown: 24 hours after scheduledDate
  const getAutoReleaseTime = () => {
    if (!isConfirmed || !booking.scheduledDate) return null
    const scheduled = new Date(booking.scheduledDate)
    const autoRelease = new Date(scheduled.getTime() + 24 * 60 * 60 * 1000)
    const now = new Date()
    if (autoRelease <= now) return "Auto-release imminent"
    const diff = autoRelease.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `Auto-release in ${hours}h ${minutes}m`
  }

  const handleScheduleUpdate = () => {
    if (!newDate && !newTime) return
    const data: { scheduledDate?: string; scheduledTime?: string } = {}
    if (newDate) data.scheduledDate = newDate
    if (newTime) data.scheduledTime = newTime
    updateSchedule.mutate({ id: booking.id, data }, {
      onSuccess: () => {
        setEditingSchedule(false)
        setNewDate("")
        setNewTime("")
      },
    })
  }

  const autoReleaseText = getAutoReleaseTime()

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
              <Badge variant={STATUS_VARIANT[booking.bookingStatus]}>
                {STATUS_LABEL[booking.bookingStatus] || booking.bookingStatus}
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

          {booking.paymentStatus === PaymentStatus.PAID && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(`${API_URL}/bookings/${booking.id}/receipt`, "_blank")}
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
          )}

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

          {!isCancelled && !isCompleted && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <CalendarPlus className="h-4 w-4" />
                  Add to Calendar
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    render={<a href={buildGoogleCalendarLink(booking)} target="_blank" rel="noopener noreferrer" />}
                  >
                    Google Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<a href={buildOutlookCalendarLink(booking)} target="_blank" rel="noopener noreferrer" />}
                  >
                    Outlook
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<a href={`${API_URL}/bookings/${booking.id}/calendar.ics`} download />}
                  >
                    Download .ics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

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
            <p className="text-sm font-medium mb-3">Status</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                {booking.agentConfirmed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                Agent {booking.agentConfirmed ? "confirmed" : "not confirmed"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {booking.clientConfirmed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                Payment {booking.clientConfirmed ? "released" : "in escrow"}
              </div>
            </div>
          </div>

          {autoReleaseText && isClient && (
            <>
              <Separator />
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-amber-800 dark:text-amber-200">
                  {autoReleaseText}. Release payment manually or it will be auto-released to the agent.
                </p>
              </div>
            </>
          )}

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

          {/* Inline schedule editor for client when awaiting agent confirmation */}
          {isClient && isAwaiting && editingSchedule && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium">Edit Schedule</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="newDate">New Date</Label>
                    <Input
                      id="newDate"
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newTime">New Time</Label>
                    <Input
                      id="newTime"
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleScheduleUpdate}
                    disabled={(!newDate && !newTime) || updateSchedule.isPending}
                  >
                    {updateSchedule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingSchedule(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Action buttons by status and role */}
          {!isCompleted && !isCancelled && !isDisputed && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-3">
                {/* AWAITING_AGENT_CONFIRMATION: client sees Edit Schedule + Cancel; agent sees Confirm + Cancel */}
                {isAwaiting && isClient && (
                  <>
                    {!editingSchedule && (
                      <Button variant="outline" className="gap-2" onClick={() => setEditingSchedule(true)}>
                        <Pencil className="h-4 w-4" />
                        Edit Schedule
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => clientRelease.mutate(booking.id)}
                      disabled={clientRelease.isPending}
                    >
                      {clientRelease.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Wallet className="h-4 w-4" />
                      Release Payment
                    </Button>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={() => cancelBooking.mutate(booking.id)}
                      disabled={cancelBooking.isPending}
                    >
                      {cancelBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}

                {isAwaiting && isAgent && (
                  <>
                    <Button
                      className="gap-2"
                      onClick={() => agentConfirm.mutate(booking.id)}
                      disabled={agentConfirm.isPending}
                    >
                      {agentConfirm.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      <CheckCircle className="h-4 w-4" />
                      Confirm Booking
                    </Button>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={() => cancelBooking.mutate(booking.id)}
                      disabled={cancelBooking.isPending}
                    >
                      {cancelBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}

                {/* CONFIRMED: client sees Release Payment + Reject; agent sees "Waiting for client" */}
                {isConfirmed && isClient && (
                  <>
                    <Button
                      className="gap-2"
                      onClick={() => clientRelease.mutate(booking.id)}
                      disabled={clientRelease.isPending}
                    >
                      {clientRelease.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Wallet className="h-4 w-4" />
                      Release Payment
                    </Button>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={() => rejectBooking.mutate(booking.id)}
                      disabled={rejectBooking.isPending}
                    >
                      {rejectBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      <AlertTriangle className="h-4 w-4" />
                      Reject / Dispute
                    </Button>
                  </>
                )}

                {isConfirmed && isAgent && (
                  <p className="text-sm text-muted-foreground italic">
                    Waiting for client to release payment after inspection.
                  </p>
                )}
              </div>
            </>
          )}

          {isCompleted && (
            <>
              <Separator />
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                <p className="text-green-800 dark:text-green-200">
                  This booking is complete. Payment has been released to the agent.
                </p>
              </div>
            </>
          )}

          {isDisputed && (
            <>
              <Separator />
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                <p className="text-red-800 dark:text-red-200">
                  This booking is under dispute. Our team will review and reach out to both parties.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
