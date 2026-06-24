export interface Review {
  id: string
  userId: string
  propertyId: string
  rating: number
  comment: string
  authorName?: string
  authorImage?: string
  createdAt: string
  updatedAt: string
}

export interface CreateReviewRequest {
  rating: number
  comment: string
}

export interface UpdateReviewRequest {
  rating?: number
  comment?: string
}

export interface ReviewSummary {
  average: number
  count: number
}
