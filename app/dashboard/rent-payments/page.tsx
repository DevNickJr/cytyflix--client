"use client"

import { useState } from "react"
import { useMyRentPayments } from "@/hooks/use-rent-payments"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES } from "@/lib/constants"
import { formatPrice, formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Banknote } from "lucide-react"
import Link from "next/link"
import type { RentPayment } from "@/types/rent-payment"
import { RentPaymentStatus } from "@/types/rent-payment"

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [RentPaymentStatus.PENDING]: "secondary",
  [RentPaymentStatus.PAID]: "outline",
  [RentPaymentStatus.MOVE_IN_CONFIRMED]: "default",
  [RentPaymentStatus.RELEASED]: "default",
  [RentPaymentStatus.DISPUTED]: "destructive",
  [RentPaymentStatus.REFUNDED]: "secondary",
}

const STATUS_LABEL: Record<string, string> = {
  [RentPaymentStatus.PENDING]: "Pending Payment",
  [RentPaymentStatus.PAID]: "In Escrow",
  [RentPaymentStatus.MOVE_IN_CONFIRMED]: "Move-In Confirmed",
  [RentPaymentStatus.RELEASED]: "Released",
  [RentPaymentStatus.DISPUTED]: "Disputed",
  [RentPaymentStatus.REFUNDED]: "Refunded",
}

function RentPaymentCard({ payment }: { payment: RentPayment }) {
  return (
    <Link href={ROUTES.DASHBOARD_RENT_PAYMENT_DETAIL(payment.id)}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={STATUS_BADGE[payment.status]}>
                  {STATUS_LABEL[payment.status] || payment.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Ref: {payment.paymentReference}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Move-in: {payment.moveInDate}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatPrice(payment.amount)}</p>
              <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function RentPaymentsPage() {
  const [role, setRole] = useState<"tenant" | "owner">("tenant")
  const { data, isLoading } = useMyRentPayments(1, 20, role)

  if (isLoading) return <PageLoader />

  const payments = data?.data || []

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rent Payments</h1>
          <p className="text-muted-foreground mt-1">Manage your rent payments and escrow</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={role === "tenant" ? "default" : "outline"}
          size="sm"
          onClick={() => setRole("tenant")}
        >
          As Tenant
        </Button>
        <Button
          variant={role === "owner" ? "default" : "outline"}
          size="sm"
          onClick={() => setRole("owner")}
        >
          As Owner
        </Button>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Banknote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-1">No rent payments yet</h3>
            <p className="text-sm text-muted-foreground">
              {role === "tenant"
                ? "Pay rent through a property listing to see it here."
                : "Rent payments from tenants will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <RentPaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      )}
    </div>
  )
}
