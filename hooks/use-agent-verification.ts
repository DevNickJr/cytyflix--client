"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { agentVerificationService } from "@/services/agent-verification.service"
import type { SubmitVerificationRequest, ReviewVerificationRequest } from "@/types/agent-verification"

export function useMyVerification() {
  return useFetch({
    queryKey: ["my-verification"],
    queryFn: () => agentVerificationService.getMyVerification(),
  })
}

export function useSubmitVerification() {
  return useMutationAction(
    (data: SubmitVerificationRequest) => agentVerificationService.submit(data),
    {
      successMessage: "Verification submitted successfully",
      invalidateKeys: [["my-verification"]],
    },
  )
}

export function useVerifications(page = 1, limit = 20, status?: string) {
  return useFetch({
    queryKey: ["verifications", page, limit, status],
    queryFn: () => agentVerificationService.getAll(page, limit, status),
  })
}

export function useReviewVerification() {
  return useMutationAction(
    ({ id, data }: { id: string; data: ReviewVerificationRequest }) =>
      agentVerificationService.review(id, data),
    {
      successMessage: "Verification reviewed successfully",
      invalidateKeys: [["verifications"]],
    },
  )
}
