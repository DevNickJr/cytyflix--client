"use client"

import { useState } from "react"
import { useVerifications, useReviewVerification } from "@/hooks/use-agent-verification"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ShieldCheck, Loader2, CheckCircle, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
}

export default function AdminVerificationsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useVerifications(page, 20, statusFilter)
  const reviewMutation = useReviewVerification()

  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = (id: string) => {
    reviewMutation.mutate({ id, data: { status: "approved" } })
  }

  const handleReject = () => {
    if (!rejectId) return
    reviewMutation.mutate(
      { id: rejectId, data: { status: "rejected", rejectionReason } },
      { onSuccess: () => { setRejectId(null); setRejectionReason("") } },
    )
  }

  if (isLoading) return <PageLoader />

  const verifications = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Verifications</h1>
        <p className="text-muted-foreground">Review agent verification requests</p>
      </div>

      <Tabs
        value={statusFilter || "all"}
        onValueChange={(v) => {
          setStatusFilter(v === "all" ? undefined : v)
          setPage(1)
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {verifications.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No verifications"
          description="No verification requests match the current filter."
        />
      ) : (
        <div className="space-y-4">
          {verifications.map((v) => (
            <Card key={v.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-3 flex-1">
                    <img
                      src={v.idDocumentUrl}
                      alt="ID Document"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <img
                      src={v.selfieUrl}
                      alt="Selfie"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">User ID: {v.userId}</p>
                      <p className="text-sm text-muted-foreground">Submitted: {formatDate(v.createdAt)}</p>
                      <Badge variant={STATUS_BADGE[v.status]} className="mt-1">
                        {v.status}
                      </Badge>
                      {v.rejectionReason && (
                        <p className="text-sm text-destructive mt-1">Reason: {v.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  {v.status === "pending" && (
                    <div className="flex gap-2 items-start">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(v.id)}
                        disabled={reviewMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setRejectId(v.id)}
                        disabled={reviewMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}

      <Dialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={reviewMutation.isPending}>
              {reviewMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
