"use client"

import Link from "next/link"
import { ROUTES, BookingStatus, PaymentStatus } from "@/lib/constants"
import { formatPrice, formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import type { Booking } from "@/types/booking"

interface BookingCardProps {
  booking: Booking
}

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [BookingStatus.PENDING]: "secondary",
  [BookingStatus.CONFIRMED]: "default",
  [BookingStatus.COMPLETED]: "default",
  [BookingStatus.DISPUTED]: "destructive",
  [BookingStatus.CANCELLED]: "destructive",
}

const PAYMENT_BADGE: Record<string, "default" | "secondary" | "destructive"> = {
  [PaymentStatus.PENDING]: "secondary",
  [PaymentStatus.PAID]: "default",
  [PaymentStatus.FAILED]: "destructive",
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <Link href={ROUTES.DASHBOARD_BOOKING_DETAIL(booking.id)}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={STATUS_BADGE[booking.bookingStatus]}>
                  {booking.bookingStatus}
                </Badge>
                <Badge variant={PAYMENT_BADGE[booking.paymentStatus]}>
                  {booking.paymentStatus}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Ref: {booking.paymentReference}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {booking.scheduledDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {booking.scheduledTime}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatPrice(booking.amount)}</p>
              <p className="text-xs text-muted-foreground">{formatDate(booking.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
