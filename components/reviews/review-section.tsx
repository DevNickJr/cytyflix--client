"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useReviews, useReviewSummary, useCreateReview, useDeleteReview } from "@/hooks/use-reviews"
import { StarRating } from "./star-rating"
import { Pagination } from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Trash2 } from "lucide-react"
import { formatRelativeTime, getInitials } from "@/lib/utils"

interface ReviewSectionProps {
  propertyId: string
  ownerId: string
}

export function ReviewSection({ propertyId, ownerId }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [page, setPage] = useState(1)
  const { data: reviewsData, isLoading } = useReviews(propertyId, page, 10)
  const { data: summaryData } = useReviewSummary(propertyId)
  const createReview = useCreateReview(propertyId)
  const deleteReview = useDeleteReview(propertyId)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const reviews = reviewsData?.data || []
  const totalPages = reviewsData?.totalPages || 1
  const summary = summaryData?.data

  const canReview = isAuthenticated && user?.id !== ownerId
  const hasReviewed = reviews.some((r) => r.userId === user?.id)

  const handleSubmit = async () => {
    if (rating === 0 || comment.length < 1) return
    await createReview.mutateAsync({ rating, comment })
    setRating(0)
    setComment("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {summary && summary.count > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(summary.average)} readonly size="sm" />
            <span className="text-sm text-muted-foreground">
              {summary.average.toFixed(1)} ({summary.count} review{summary.count !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {canReview && !hasReviewed && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-medium">Write a review</p>
            <StarRating value={rating} onChange={setRating} />
            <Textarea
              placeholder="Share your experience with this property..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              disabled={createReview.isPending || rating === 0 || comment.length < 1}
              size="sm"
            >
              {createReview.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review this property.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={review.authorImage} />
                <AvatarFallback className="text-xs">
                  {getInitials(review.authorName?.split(" ")[0], review.authorName?.split(" ")[1])}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{review.authorName || "Anonymous"}</span>
                  <StarRating value={review.rating} readonly size="sm" />
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(review.createdAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                {user?.id === review.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-7 text-xs text-muted-foreground"
                    onClick={() => deleteReview.mutate(review.id)}
                    disabled={deleteReview.isPending}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}
    </div>
  )
}
