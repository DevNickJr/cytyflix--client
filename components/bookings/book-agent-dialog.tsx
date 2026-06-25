"use client"

import { useState } from "react"
import { useCreateBooking } from "@/hooks/use-bookings"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Property } from "@/types/property"

interface BookAgentDialogProps {
  agentId: string
  propertyId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  properties: Property[]
}

export function BookAgentDialog({ agentId, propertyId, open, onOpenChange, properties }: BookAgentDialogProps) {
  const createBooking = useCreateBooking()
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [notes, setNotes] = useState("")
  const [linkedPropertyId, setLinkedPropertyId] = useState(propertyId || "")

  const handleSubmit = async () => {
    if (!scheduledDate || !scheduledTime || !linkedPropertyId) return
    const result = await createBooking.mutateAsync({
      agentId,
      propertyId: linkedPropertyId,
      scheduledDate,
      scheduledTime,
      notes: notes || undefined,
    })

    if (result.data.authorization_url) {
      window.location.href = result.data.authorization_url
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Agent for Property Tour</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 w-full relative">
          {(
          <Select
            value={linkedPropertyId}
            onValueChange={(val) => val && setLinkedPropertyId(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Property" />
            </SelectTrigger>
            <SelectContent >
                <SelectItem value={'any'}>
                  Any Available
                </SelectItem>
              {properties?.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Any specific requirements or questions?"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Booking Fee</p>
            <p className="text-2xl font-bold">{formatPrice(5000)}</p>
            <p className="text-xs text-muted-foreground">
              Funds are held in escrow until both parties confirm the meeting.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={createBooking.isPending || !scheduledDate || !scheduledTime || !linkedPropertyId}
          >
            {createBooking.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pay & Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
