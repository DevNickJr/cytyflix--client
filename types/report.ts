import { ReportReason, ReportStatus } from "@/lib/constants"

export interface Report {
  id: string
  userId: string
  propertyId: string
  reason: ReportReason
  description: string
  status: ReportStatus
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateReportRequest {
  reason: ReportReason
  description: string
}

export interface ReviewReportRequest {
  status: "reviewed" | "dismissed"
}
