"use client"

import { useState } from "react"
import { useCreateReport } from "@/hooks/use-reports"
import { ReportReason, REPORT_REASON_LABELS } from "@/lib/constants"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ReportDialogProps {
  propertyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDialog({ propertyId, open, onOpenChange }: ReportDialogProps) {
  const createReport = useCreateReport(propertyId)
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    if (!reason || description.length < 10) return
    await createReport.mutateAsync({ reason: reason as ReportReason, description })
    setReason("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Property</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={(val) => setReason(val as ReportReason)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_REASON_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Please describe the issue in detail (min 10 characters)..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={createReport.isPending || !reason || description.length < 10}
          >
            {createReport.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
