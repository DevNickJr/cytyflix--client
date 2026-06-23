"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { savedListingService } from "@/services/saved-listing.service"

export function useSavedListings(page = 1, limit = 20) {
  return useFetch({
      queryKey: ["saved-listings", page, limit],
      queryFn: () => savedListingService.getSavedListings(page, limit)
    }    
  )
}

export function useSaveStatus(propertyId: string) {
  return useFetch({
    queryKey: ["save-status", propertyId],
    queryFn: () => savedListingService.getSaveStatus(propertyId),
    options: { enabled: !!propertyId }
  })
}

export function useToggleSave() {
  return useMutationAction(
    (propertyId: string) => savedListingService.toggleSave(propertyId),
    {
      invalidateKeys: [["saved-listings"], ["save-status"]],
    }
  )
}
