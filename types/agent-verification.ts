export interface AgentVerification {
  id: string
  userId: string
  idDocumentUrl: string
  selfieUrl: string
  utilityBillUrl?: string
  ninNumber?: string
  ninVerified?: boolean
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
  utilityBillUrl: string
  ninNumber?: string
}

export interface ReviewVerificationRequest {
  status: "approved" | "rejected"
  rejectionReason?: string
}
