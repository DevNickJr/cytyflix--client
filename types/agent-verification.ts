export interface AgentVerification {
  id: string
  userId: string
  idDocumentUrl: string
  selfieUrl: string
  status: "pending" | "approved" | "rejected"
  rejectionReason?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface SubmitVerificationRequest {
  idDocumentUrl: string
  selfieUrl: string
}

export interface ReviewVerificationRequest {
  status: "approved" | "rejected"
  rejectionReason?: string
}
