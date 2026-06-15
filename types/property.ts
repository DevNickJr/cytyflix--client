import { PropertyType, ListingType } from "@/lib/constants"

export interface Property {
  id: string
  title: string
  description: string
  propertyType: PropertyType
  listingType: ListingType
  price: number
  currency: string
  address: string
  city: string
  state: string
  country: string
  latitude?: number
  longitude?: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  images: string[]
  isAvailable: boolean
  isFeatured: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePropertyRequest {
  title: string
  description: string
  propertyType: PropertyType
  listingType: ListingType
  price: number
  currency?: string
  address: string
  city: string
  state: string
  country?: string
  latitude?: number
  longitude?: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  images?: string[]
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}

export interface PropertyFilters {
  city?: string
  state?: string
  propertyType?: PropertyType
  listingType?: ListingType
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string
  page?: number
  limit?: number
  sortBy?: "createdAt" | "price"
  sortOrder?: "ASC" | "DESC"
}
