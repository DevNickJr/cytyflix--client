export enum RentPaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  MOVE_IN_CONFIRMED = "confirmed",
  RELEASED = "released",
  DISPUTED = "disputed",
  REFUNDED = "refunded",
}

export interface RentPayment {
  id: string
  propertyId: string
  tenantId: string
  ownerId: string
  amount: number
  paymentReference: string
  paymentStatus: string
  status: RentPaymentStatus
  moveInDate: string
  tenantConfirmed: boolean
  confirmedAt?: string
  releasedAt?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateRentPaymentRequest {
  propertyId: string
  ownerId: string
  amount: number
  moveInDate: string
}

export interface CreateRentPaymentResponse {
  rentPayment: RentPayment
  authorization_url: string
  reference: string
}
