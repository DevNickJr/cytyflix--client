"use client"

import { PropertyType, ListingType, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import type { PropertyFilters as PropertyFiltersType } from "@/types/property"
import { usePlaces } from "@/hooks/usePlaces"

interface PropertyFiltersProps {
  filters: PropertyFiltersType
  onFilterChange: (filters: Partial<PropertyFiltersType>) => void
  onReset: () => void
  forMobile?: boolean
}

export function PropertyFilters({ filters, onFilterChange, onReset, forMobile }: PropertyFiltersProps) {
  const hasActiveFilters = filters.city || filters.state || filters.propertyType ||
    filters.listingType || filters.minPrice || filters.maxPrice ||
    filters.bedrooms || filters.bathrooms

    const { cities, lgas, states } = usePlaces({
      city: filters.city,
      lga: filters.lga,
      state: filters.state,
      resetLga: () => onFilterChange({ lga: undefined }),
      resetCity: () => onFilterChange({ city: undefined }),
    })

  return (
    <Card className={forMobile ? 'md:hidden overflow-y-auto h-full' : 'hidden md:block'}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-1 text-xs">
              <X className="h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">State</Label>
            <Select
              value={filters.state || ""}
              onValueChange={(val) => onFilterChange({ state: val || undefined })}
            >
              <SelectTrigger className={'w-full'}><SelectValue placeholder="All States" /></SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state?.state} value={state?.state}>{state?.state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">LGA</Label>
            <Select
              value={filters.lga || ""}
              onValueChange={(val) => onFilterChange({ lga: val || undefined })}
              disabled={!filters.state}
            >
              <SelectTrigger className={'w-full'}><SelectValue placeholder={filters.state ? "Enter LGA" : "Select a state"} /></SelectTrigger>
              <SelectContent>
                {lgas.map((lga) => (
                  <SelectItem key={lga?.name} value={lga?.name}>{lga?.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">City/Ward</Label>
            <Select
              value={filters.city || ""}
              onValueChange={(val) => onFilterChange({ city: val || undefined })}
              disabled={!filters.state || !filters.lga}
            >
              <SelectTrigger className={'w-full'}><SelectValue placeholder={filters.state ? "Enter City" : "Select an LGA"} /></SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city?.name} value={city?.name}>{city?.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Property Type</Label>
            <Select
              value={filters.propertyType || ""}
              onValueChange={(val) => onFilterChange({ propertyType: (val || undefined) as PropertyType | undefined })}
            >
              <SelectTrigger className={'w-full'}><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Listing Type</Label>
            <Select
              value={filters.listingType || ""}
              onValueChange={(val) => onFilterChange({ listingType: (val || undefined) as ListingType | undefined })}
            >
              <SelectTrigger className={'w-full'}><SelectValue placeholder="All Listings" /></SelectTrigger>
              <SelectContent>
                {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Min Price</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minPrice || ""}
              onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Max Price</Label>
            <Input
              type="number"
              placeholder="No max"
              value={filters.maxPrice || ""}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Bedrooms</Label>
            <Select
              value={filters.bedrooms?.toString() || ""}
              onValueChange={(val) => onFilterChange({ bedrooms: val ? Number(val) : undefined })}
            >
              <SelectTrigger className={'w-full'}><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={n.toString()}>{n}+</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Bathrooms</Label>
            <Select
              value={filters.bathrooms?.toString() || ""}
              onValueChange={(val) => onFilterChange({ bathrooms: val ? Number(val) : undefined })}
            >
              <SelectTrigger className={'w-full'}><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((n) => (
                  <SelectItem key={n} value={n.toString()}>{n}+</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Sort by</Label>
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(val) => {
                if (!val) return
                const [sortBy, sortOrder] = val.split("-") as ["createdAt" | "price", "ASC" | "DESC"]
                onFilterChange({ sortBy, sortOrder })
              }}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-DESC">Newest First</SelectItem>
                <SelectItem value="createdAt-ASC">Oldest First</SelectItem>
                <SelectItem value="price-ASC">Price: Low to High</SelectItem>
                <SelectItem value="price-DESC">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
