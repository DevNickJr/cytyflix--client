import type { Property } from "./property"

export interface SavedListing {
  id: string
  userId: string
  propertyId: string
  property?: Property
  createdAt: string
}

export interface ToggleSaveRequest {
  propertyId: string
}

export interface SaveStatusResponse {
  isSaved: boolean
  savedListingId?: string
}
