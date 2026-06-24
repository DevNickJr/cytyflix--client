"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { reportService } from "@/services/report.service"
import type { CreateReportRequest, ReviewReportRequest } from "@/types/report"

export function useCreateReport(propertyId: string) {
  return useMutationAction(
    (data: CreateReportRequest) => reportService.createReport(propertyId, data),
    {
      successMessage: "Report submitted successfully",
    },
  )
}

export function useReports(page = 1, limit = 20, status?: string) {
  return useFetch({
    queryKey: ["reports", page, limit, status],
    queryFn: () => reportService.getReports(page, limit, status),
  })
}

export function useReviewReport() {
  return useMutationAction(
    ({ id, data }: { id: string; data: ReviewReportRequest }) =>
      reportService.reviewReport(id, data),
    {
      successMessage: "Report updated",
      invalidateKeys: [["reports"]],
    },
  )
}
