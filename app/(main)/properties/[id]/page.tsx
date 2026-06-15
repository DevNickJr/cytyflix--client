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
} from "lucide-react"
import { toast } from "sonner"
import type { ApiError } from "@/types/api"

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

  if (isLoading) return <PageLoader />

  const property = data?.data
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-muted-foreground mb-4">The property you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push(ROUTES.PROPERTIES)}>Browse Properties</Button>
      </div>
    )
  }

  const isSaved = saveData?.data?.isSaved ?? false

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
          {/* Image Gallery */}
          <div className="rounded-xl overflow-hidden bg-muted">
            {property.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full aspect-[4/3] object-cover md:row-span-2"
                />
                {property.images.slice(1, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${property.title} ${i + 2}`}
                    className="w-full aspect-video object-cover hidden md:block"
                  />
                ))}
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <Building className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

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
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              {isAuthenticated && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => toggleSave.mutate(property.id)}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                  {isSaved ? "Saved" : "Save Property"}
                </Button>
              )}
            </CardContent>
          </Card>

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
        </div>
      </div>
    </div>
  )
}
