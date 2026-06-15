"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { inquiryService } from "@/services/inquiry.service"
import type { SendInquiryRequest, UpdateInquiryStatusRequest } from "@/types/inquiry"

export function useSentInquiries(page = 1, limit = 20) {
  return useFetch(
    ["inquiries-sent", String(page), String(limit)],
    () => inquiryService.getSentInquiries(page, limit)
  )
}

export function useReceivedInquiries(page = 1, limit = 20) {
  return useFetch(
    ["inquiries-received", String(page), String(limit)],
    () => inquiryService.getReceivedInquiries(page, limit)
  )
}

export function useSendInquiry() {
  return useMutationAction(
    (data: SendInquiryRequest) => inquiryService.sendInquiry(data),
    {
      successMessage: "Inquiry sent successfully",
      invalidateKeys: [["inquiries-sent"]],
    }
  )
}

export function useUpdateInquiryStatus(id: string) {
  return useMutationAction(
    (data: UpdateInquiryStatusRequest) => inquiryService.updateInquiryStatus(id, data),
    {
      successMessage: "Inquiry status updated",
      invalidateKeys: [["inquiries-received"], ["inquiries-sent"]],
    }
  )
}
