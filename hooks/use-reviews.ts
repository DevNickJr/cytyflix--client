"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { reviewService } from "@/services/review.service"
import type { CreateReviewRequest, UpdateReviewRequest } from "@/types/review"

export function useReviews(propertyId: string, page = 1, limit = 20) {
  return useFetch({
    queryKey: ["reviews", propertyId, page, limit],
    queryFn: () => reviewService.getReviews(propertyId, page, limit),
    options: { enabled: !!propertyId },
  })
}

export function useReviewSummary(propertyId: string) {
  return useFetch({
    queryKey: ["review-summary", propertyId],
    queryFn: () => reviewService.getSummary(propertyId),
    options: { enabled: !!propertyId },
  })
}

export function useCreateReview(propertyId: string) {
  return useMutationAction(
    (data: CreateReviewRequest) => reviewService.createReview(propertyId, data),
    {
      successMessage: "Review submitted successfully",
      invalidateKeys: [["reviews", propertyId], ["review-summary", propertyId]],
    },
  )
}

export function useUpdateReview(propertyId: string) {
  return useMutationAction(
    ({ reviewId, data }: { reviewId: string; data: UpdateReviewRequest }) =>
      reviewService.updateReview(propertyId, reviewId, data),
    {
      successMessage: "Review updated successfully",
      invalidateKeys: [["reviews", propertyId], ["review-summary", propertyId]],
    },
  )
}

export function useDeleteReview(propertyId: string) {
  return useMutationAction(
    (reviewId: string) => reviewService.deleteReview(propertyId, reviewId),
    {
      successMessage: "Review deleted",
      invalidateKeys: [["reviews", propertyId], ["review-summary", propertyId]],
    },
  )
}
