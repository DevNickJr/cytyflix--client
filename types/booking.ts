import { BookingStatus, PaymentStatus } from "@/lib/constants"

export interface Booking {
  id: string
  clientId: string
  agentId: string
  propertyId: string
  amount: number
  paymentReference: string
  paymentStatus: PaymentStatus
  bookingStatus: BookingStatus
  clientConfirmed: boolean
  agentConfirmed: boolean
  scheduledDate: string
  scheduledTime: string
  notes?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookingRequest {
  agentId: string
  propertyId: string
  scheduledDate: string
  scheduledTime: string
  notes?: string
}

export interface CreateBookingResponse {
  booking: Booking
  authorization_url: string
  reference: string
}
