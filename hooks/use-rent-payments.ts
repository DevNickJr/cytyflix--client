"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { rentPaymentService } from "@/services/rent-payment.service"
import type { CreateRentPaymentRequest } from "@/types/rent-payment"

export function useMyRentPayments(page = 1, limit = 20, role: "tenant" | "owner" = "tenant") {
  return useFetch({
    queryKey: ["rent-payments", role, page, limit],
    queryFn: () => rentPaymentService.getMyRentPayments(page, limit, role),
  })
}

export function useRentPayment(id: string) {
  return useFetch({
    queryKey: ["rent-payment", id],
    queryFn: () => rentPaymentService.getRentPayment(id),
    options: { enabled: !!id },
  })
}

export function useCreateRentPayment() {
  return useMutationAction(
    (data: CreateRentPaymentRequest) => rentPaymentService.createRentPayment(data),
    {
      successMessage: "Rent payment initiated. Redirecting to payment...",
      invalidateKeys: [["rent-payments"]],
    },
  )
}

export function useConfirmMoveIn() {
  return useMutationAction(
    (id: string) => rentPaymentService.confirmMoveIn(id),
    {
      successMessage: "Move-in confirmed. Payment released to owner.",
      invalidateKeys: [["rent-payments"], ["rent-payment"]],
    },
  )
}

export function useDisputeRentPayment() {
  return useMutationAction(
    (id: string) => rentPaymentService.disputeRentPayment(id),
    {
      successMessage: "Dispute raised. Our team will review it.",
      invalidateKeys: [["rent-payments"], ["rent-payment"]],
    },
  )
}
