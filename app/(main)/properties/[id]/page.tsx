"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useProperty } from "@/hooks/use-properties"
import { useAuth } from "@/hooks/use-auth"
import { useSaveStatus, useToggleSave } from "@/hooks/use-saved-listings"
import { useSendInquiry } from "@/hooks/use-inquiries"
import { ROUTES, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/constants"
import { formatPrice, formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Building,
  Calendar,
  CheckCircle,
  Send,
  Flag,
} from "lucide-react"
import { toast } from "sonner"
import type { ApiError } from "@/types/api"
import { ReviewSection } from "@/components/reviews/review-section"
import { ReportDialog } from "@/components/reviews/report-dialog"
import { ShareButtons } from "@/components/shared/share-buttons"
import { useTrackPageView } from "@/hooks/use-analytics"
import { EventType } from "@/types/analytics"

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data, isLoading } = useProperty(id)
  const { data: saveData } = useSaveStatus(id)
  const toggleSave = useToggleSave()
  const sendInquiry = useSendInquiry()
  const [message, setMessage] = useState("")
  
  const [reportOpen, setReportOpen] = useState(false)
  const isSaved = saveData?.data?.isSaved ?? false
  const property = data?.data

  useTrackPageView(EventType.PROPERTY_VIEW, id)

  if (isLoading) return <PageLoader />
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-muted-foreground mb-4">The property you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push(ROUTES.PROPERTIES)}>Browse Properties</Button>
      </div>
    )
  }



  const handleInquiry = async () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
      return
    }
    if (message.length < 10) {
      toast.error("Message must be at least 10 characters")
      return
    }
    try {
      await sendInquiry.mutateAsync({ propertyId: property.id, message })
      setMessage("")
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || "Failed to send inquiry")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery by Category */}
          {(() => {
            const allImages = [
              ...property.exteriorImages,
              ...property.interiorImages,
              ...property.streetImages,
            ]
            return allImages.length > 0 ? (
              <div className="rounded-xl overflow-hidden bg-muted">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <img
                    src={allImages[0]}
                    alt={property.title}
                    className="w-full aspect-[4/3] object-cover md:row-span-2"
                  />
                  {allImages.slice(1, 3).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${property.title} ${i + 2}`}
                      className="w-full aspect-video object-cover hidden md:block"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                <Building className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )
          })()}

          {/* Categorized Image Sections */}
          {property.exteriorImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Exterior</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.exteriorImages.map((img, i) => (
                  <img key={i} src={img} alt={`Exterior ${i + 1}`} className="w-full aspect-video object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {property.interiorImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Interior</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.interiorImages.map((img, i) => (
                  <img key={i} src={img} alt={`Interior ${i + 1}`} className="w-full aspect-video object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {property.streetImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Street / Landmarks</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.streetImages.map((img, i) => (
                  <img key={i} src={img} alt={`Street ${i + 1}`} className="w-full aspect-video object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge>{LISTING_TYPE_LABELS[property.listingType]}</Badge>
                  <Badge variant="outline">{PROPERTY_TYPE_LABELS[property.propertyType]}</Badge>
                  {property.isFeatured && <Badge className="bg-yellow-500 text-white">Featured</Badge>}
                  {property.isAvailable ? (
                    <Badge variant="outline" className="text-green-600 border-green-200">Available</Badge>
                  ) : (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{property.address}, {property.city}, {property.state}</span>
            </div>

            <div className="text-3xl font-bold mb-6">
              {formatPrice(property.price, property.currency)}
              {property.listingType === "rent" && <span className="text-base font-normal text-muted-foreground">/month</span>}
              {property.listingType === "shortlet" && <span className="text-base font-normal text-muted-foreground">/night</span>}
            </div>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-muted-foreground" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span>{property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Listed {formatDate(property.createdAt)}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
            </div>

            {property.amenities.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator className="my-6" />

            <ReviewSection propertyId={property.id} ownerId={property.ownerId} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
           {isAuthenticated && 
            (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => toggleSave.mutate(property.id)}
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                {isSaved ? "Saved" : "Save Property"}
              </Button>
              )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send an Inquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Hi, I'm interested in this property. Is it still available?"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                className="w-full gap-2"
                onClick={handleInquiry}
                disabled={sendInquiry.isPending}
              >
                <Send className="h-4 w-4" />
                {isAuthenticated ? "Send Inquiry" : "Sign in to Inquire"}
              </Button>
            </CardContent>
          </Card>

          {isAuthenticated && (
            <Button
              variant="outline"
              className="w-full gap-2 text-muted-foreground"
              onClick={() => setReportOpen(true)}
            >
              <Flag className="h-4 w-4" />
              Report Property
            </Button>
          )}

          <ReportDialog
            propertyId={property.id}
            open={reportOpen}
            onOpenChange={setReportOpen}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share Property</CardTitle>
            </CardHeader>
            <CardContent>
              <ShareButtons
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={property.title}
                description={property.description}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
