export interface AgentStats {
  profileViews: number
  totalProperties: number
  averageRating: number
  totalReviews: number
}

export interface AgentFilters {
  city?: string
  lga?: string
  state?: string
  page?: number
  limit?: number
  sortBy?: "createdAt" | "price"
  sortOrder?: "ASC" | "DESC"
}