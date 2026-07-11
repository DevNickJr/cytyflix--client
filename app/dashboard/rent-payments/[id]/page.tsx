"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useRentPayment, useConfirmMoveIn, useDisputeRentPayment } from "@/hooks/use-rent-payments"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES } from "@/lib/constants"
import { formatPrice, formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Clock,
  Home,
} from "lucide-react"
import { RentPaymentStatus } from "@/types/rent-payment"

const STATUS_LABEL: Record<string, string> = {
  [RentPaymentStatus.PENDING]: "Pending Payment",
  [RentPaymentStatus.PAID]: "In Escrow",
  [RentPaymentStatus.MOVE_IN_CONFIRMED]: "Move-In Confirmed",
  [RentPaymentStatus.RELEASED]: "Released to Owner",
  [RentPaymentStatus.DISPUTED]: "Disputed",
  [RentPaymentStatus.REFUNDED]: "Refunded",
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [RentPaymentStatus.PENDING]: "secondary",
  [RentPaymentStatus.PAID]: "outline",
  [RentPaymentStatus.MOVE_IN_CONFIRMED]: "default",
  [RentPaymentStatus.RELEASED]: "default",
  [RentPaymentStatus.DISPUTED]: "destructive",
  [RentPaymentStatus.REFUNDED]: "secondary",
}

export default function RentPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { data, isLoading } = useRentPayment(id)
  const confirmMoveIn = useConfirmMoveIn()
  const disputePayment = useDisputeRentPayment()

  if (isLoading) return <PageLoader />

  const payment = data?.data
  if (!payment) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Rent Payment Not Found</h1>
        <Button onClick={() => router.push(ROUTES.DASHBOARD_RENT_PAYMENTS)}>Back to Rent Payments</Button>
      </div>
    )
  }

  const isTenant = user?.id === payment.tenantId
  const isOwner = user?.id === payment.ownerId
  const isPaid = payment.status === RentPaymentStatus.PAID
  const isReleased = payment.status === RentPaymentStatus.RELEASED
  const isConfirmed = payment.status === RentPaymentStatus.MOVE_IN_CONFIRMED
  const isDisputed = payment.status === RentPaymentStatus.DISPUTED

  // Auto-release countdown
  const getAutoReleaseTime = () => {
    if (!isPaid || !payment.expiresAt) return null
    const expires = new Date(payment.expiresAt)
    const now = new Date()
    if (expires <= now) return "Auto-release imminent"
    const diff = expires.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `Auto-release in ${days}d ${hours}h`
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
            <CardTitle>Rent Payment Details</CardTitle>
            <Badge variant={STATUS_VARIANT[payment.status]}>
              {STATUS_LABEL[payment.status] || payment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Reference</p>
              <p className="font-mono text-sm">{payment.paymentReference}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-bold">{formatPrice(payment.amount)}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Move-in Date</p>
                <p className="font-medium">{payment.moveInDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {payment.tenantConfirmed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Move-in Status</p>
                <p className="font-medium">{payment.tenantConfirmed ? "Confirmed" : "Not confirmed"}</p>
              </div>
            </div>
          </div>

          {autoReleaseText && isTenant && (
            <>
              <Separator />
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-amber-800 dark:text-amber-200">
                  {autoReleaseText}. Confirm move-in or raise a dispute before auto-release.
                </p>
              </div>
            </>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <p>Created: {formatDate(payment.createdAt)}</p>
            {payment.releasedAt && <p>Released: {formatDate(payment.releasedAt)}</p>}
            {payment.confirmedAt && <p>Confirmed: {formatDate(payment.confirmedAt)}</p>}
          </div>

          {/* Tenant actions when payment is in escrow */}
          {isPaid && isTenant && (
            <>
              <Separator />
              <div className="flex gap-3">
                <Button
                  className="gap-2"
                  onClick={() => confirmMoveIn.mutate(payment.id)}
                  disabled={confirmMoveIn.isPending}
                >
                  {confirmMoveIn.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Home className="h-4 w-4" />
                  Confirm Move-In
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => disputePayment.mutate(payment.id)}
                  disabled={disputePayment.isPending}
                >
                  {disputePayment.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  <AlertTriangle className="h-4 w-4" />
                  Dispute
                </Button>
              </div>
            </>
          )}

          {isPaid && isOwner && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground italic">
                Waiting for tenant to confirm move-in. Payment will auto-release 3 days after the move-in date.
              </p>
            </>
          )}

          {(isReleased || isConfirmed) && (
            <>
              <Separator />
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                <p className="text-green-800 dark:text-green-200">
                  Payment has been released to the property owner.
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
                  This payment is under dispute. Our team will review and reach out to both parties.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
