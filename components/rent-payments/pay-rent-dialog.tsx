"use client"

import { useState } from "react"
import { useCreateRentPayment } from "@/hooks/use-rent-payments"
import { formatPrice } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Banknote, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PayRentDialogProps {
  propertyId: string
  ownerId: string
  defaultAmount: number
}

export function PayRentDialog({ propertyId, ownerId, defaultAmount }: PayRentDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(defaultAmount.toString())
  const [moveInDate, setMoveInDate] = useState("")
  const createRentPayment = useCreateRentPayment()

  const handleSubmit = async () => {
    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount < 1000) {
      toast.error("Amount must be at least NGN 1,000")
      return
    }
    if (!moveInDate) {
      toast.error("Please select a move-in date")
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (new Date(moveInDate) < today) {
      toast.error("Move-in date cannot be in the past")
      return
    }

    try {
      const result = await createRentPayment.mutateAsync({
        propertyId,
        ownerId,
        amount: parsedAmount,
        moveInDate,
      })
      const authUrl = result?.data?.authorization_url
      if (authUrl) {
        window.location.href = authUrl
      }
    } catch {
      // Error handled by mutation hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button className="w-full gap-2" />}
      >
        <Banknote className="h-4 w-4" />
        Pay Rent
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Rent</DialogTitle>
          <DialogDescription>
            Your payment will be held in escrow until you confirm move-in or 3 days after the move-in date.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rent-amount">Amount (NGN)</Label>
            <Input
              id="rent-amount"
              type="number"
              min="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            {Number(amount) > 0 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(Number(amount))}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="move-in-date">Move-in Date</Label>
            <Input
              id="move-in-date"
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={createRentPayment.isPending}
            className="gap-2"
          >
            {createRentPayment.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Pay {Number(amount) > 0 ? formatPrice(Number(amount)) : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
