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

export function useAgentConfirmBooking() {
  return useMutationAction(
    (id: string) => bookingService.agentConfirmBooking(id),
    {
      successMessage: "Booking confirmed",
      invalidateKeys: [["bookings"], ["booking"]],
    },
  )
}

export function useClientReleaseBooking() {
  return useMutationAction(
    (id: string) => bookingService.clientReleaseBooking(id),
    {
      successMessage: "Payment released to agent",
      invalidateKeys: [["bookings"], ["booking"]],
    },
  )
}

export function useUpdateBookingSchedule() {
  return useMutationAction(
    ({ id, data }: { id: string; data: { scheduledDate?: string; scheduledTime?: string } }) =>
      bookingService.updateBookingSchedule(id, data),
    {
      successMessage: "Schedule updated",
      invalidateKeys: [["bookings"], ["booking"]],
    },
  )
}

export function useRejectBooking() {
  return useMutationAction(
    (id: string) => bookingService.rejectBooking(id),
    {
      successMessage: "Booking disputed",
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
