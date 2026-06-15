"use client"

import { PropertyCard } from "./property-card"
import type { Property } from "@/types/property"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2 } from "lucide-react"

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No properties found"
        description="Try adjusting your search filters or check back later for new listings."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
