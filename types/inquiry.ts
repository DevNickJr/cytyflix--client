import { InquiryStatus } from "@/lib/constants"
import type { Property } from "./property"
import type { User } from "./user"

export interface Inquiry {
  id: string
  senderId: string
  propertyId: string
  recipientId: string
  message: string
  status: InquiryStatus
  sender?: User
  recipient?: User
  property?: Property
  createdAt: string
  updatedAt: string
}

export interface SendInquiryRequest {
  propertyId: string
  message: string
}

export interface UpdateInquiryStatusRequest {
  status: InquiryStatus.RESPONDED | InquiryStatus.CLOSED
}
