"use client"

import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, BedDouble, Bath, Building } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToggleSave } from "@/hooks/use-saved-listings"
import type { Property } from "@/types/property"
import { motion } from "motion/react"

interface PropertyCardProps {
  property: Property
  isSaved?: boolean
}

export function PropertyCard({ property, isSaved }: PropertyCardProps) {
  const { isAuthenticated } = useAuth()
  const toggleSave = useToggleSave()

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated) {
      toggleSave.mutate(property.id)
    }
  }

  const thumbnail = property.exteriorImages?.[0] || property.interiorImages?.[0] || property.proofOfOwnership?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={ROUTES.PROPERTY_DETAIL(property.id)}>
        <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
          <div className="relative aspect-[16/10] bg-muted overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                {LISTING_TYPE_LABELS[property.listingType]}
              </Badge>
              {property.isFeatured && (
                <Badge className="bg-yellow-500/90 text-white backdrop-blur-sm">Featured</Badge>
              )}
            </div>
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8"
                onClick={handleSave}
              >
                <Heart
                  className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <p className="font-bold text-base shrink-0">
                {formatPrice(property.price, property.currency)}
                {property.listingType === "rent" && (
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                )}
                {property.listingType === "shortlet" && (
                  <span className="text-xs font-normal text-muted-foreground">/night</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{property.city}, {property.state}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
              </span>
              <Badge variant="outline" className="text-xs">
                {PROPERTY_TYPE_LABELS[property.propertyType]}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
