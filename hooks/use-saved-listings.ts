"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { savedListingService } from "@/services/saved-listing.service"

export function useSavedListings(page = 1, limit = 20) {
  return useFetch(
    ["saved-listings", String(page), String(limit)],
    () => savedListingService.getSavedListings(page, limit)
  )
}

export function useSaveStatus(propertyId: string) {
  return useFetch(
    ["save-status", propertyId],
    () => savedListingService.getSaveStatus(propertyId),
    { enabled: !!propertyId }
  )
}

export function useToggleSave() {
  return useMutationAction(
    (propertyId: string) => savedListingService.toggleSave(propertyId),
    {
      invalidateKeys: [["saved-listings"], ["save-status"]],
    }
  )
}
