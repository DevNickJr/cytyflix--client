"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { bookingService } from "@/services/booking.service"
import type { CreateBookingRequest } from "@/types/booking"

export function useMyBookings(page = 1, limit = 20, role: "client" | "agent" = "client") {
  return useFetch({
    queryKey: ["bookings", role, page, limit],
    queryFn: () => bookingService.getMyBookings(page, limit, role),
  })
}

export function useBooking(id: string) {
  return useFetch({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBooking(id),
    options: { enabled: !!id },
  })
}

export function useCreateBooking() {
  return useMutationAction(
    (data: CreateBookingRequest) => bookingService.createBooking(data),
    {
      successMessage: "Booking created. Redirecting to payment...",
      invalidateKeys: [["bookings"]],
    },
  )
}

export function useConfirmBooking() {
  return useMutationAction(
    (id: string) => bookingService.confirmBooking(id),
    {
      successMessage: "Meeting confirmed",
      invalidateKeys: [["bookings"], ["booking"]],
    },
  )
}

export function useCancelBooking() {
  return useMutationAction(
    (id: string) => bookingService.cancelBooking(id),
    {
      successMessage: "Booking cancelled",
      invalidateKeys: [["bookings"], ["booking"]],
    },
  )
}
