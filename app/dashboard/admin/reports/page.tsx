"use client"

import { useState } from "react"
import { useReports, useReviewReport } from "@/hooks/use-reports"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flag, CheckCircle, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { REPORT_REASON_LABELS, type ReportReason } from "@/lib/constants"

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  reviewed: "default",
  dismissed: "destructive",
}

export default function AdminReportsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useReports(page, 20, statusFilter)
  const reviewMutation = useReviewReport()

  if (isLoading) return <PageLoader />

  const reports = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Property Reports</h1>
        <p className="text-muted-foreground">Review reported properties</p>
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
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
        </TabsList>
      </Tabs>

      {reports.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No reports"
          description="No reports match the current filter."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={STATUS_BADGE[report.status]}>{report.status}</Badge>
                      <Badge variant="outline">
                        {REPORT_REASON_LABELS[report.reason as ReportReason] || report.reason}
                      </Badge>
                    </div>
                    <p className="text-sm mb-1">{report.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Property: {report.propertyId} | Reported: {formatDate(report.createdAt)}
                    </p>
                  </div>
                  {report.status === "pending" && (
                    <div className="flex gap-2 items-start">
                      <Button
                        size="sm"
                        onClick={() => reviewMutation.mutate({ id: report.id, data: { status: "reviewed" } })}
                        disabled={reviewMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Reviewed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reviewMutation.mutate({ id: report.id, data: { status: "dismissed" } })}
                        disabled={reviewMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Dismiss
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
    </div>
  )
}
