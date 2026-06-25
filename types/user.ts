import { RolesEnum } from "@/lib/constants"

export interface UserProfile {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  bio?: string
  preferredLocation?: string
  budgetMin?: number
  budgetMax?: number
  profileImage?: string
  operatingStates?: string[]
  operatingLgas?: string[]
  operatingCities?: string[]
}

export interface User {
  id: string
  email: string
  role: RolesEnum
  isVerified: boolean
  profile?: UserProfile | null
  createdAt: string
  updatedAt?: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  bio?: string
  preferredLocation?: string
  budgetMin?: number
  budgetMax?: number
  profileImage?: string
  operatingStates?: string[]
  operatingLgas?: string[]
  operatingCities?: string[]
}
