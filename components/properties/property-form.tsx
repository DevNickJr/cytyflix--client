"use client"

import { useEffect, useState } from "react"
import { PropertyType, ListingType, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/shared/image-upload"
import { Loader2 } from "lucide-react"
import type { CreatePropertyRequest, Property } from "@/types/property"
import { usePlaces } from "@/hooks/usePlaces"

interface PropertyFormProps {
  initialData?: Property
  onSubmit: (data: CreatePropertyRequest) => void
  isLoading: boolean
  submitLabel?: string
}

export function PropertyForm({ initialData, onSubmit, isLoading, submitLabel = "Create Property" }: PropertyFormProps) {
  const [form, setForm] = useState<CreatePropertyRequest>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    propertyType: initialData?.propertyType ?? PropertyType.APARTMENT,
    listingType: initialData?.listingType ?? ListingType.RENT,
    price: initialData?.price ?? 0,
    currency: initialData?.currency ?? "NGN",
    address: initialData?.address ?? "",
    city: initialData?.city ?? "",
    lga: initialData?.lga ?? "",
    state: initialData?.state ?? "",
    country: initialData?.country ?? "Nigeria",
    bedrooms: initialData?.bedrooms ?? 1,
    bathrooms: initialData?.bathrooms ?? 1,
    amenities: initialData?.amenities ?? [],
    proofOfOwnership: initialData?.proofOfOwnership ?? [],
    interiorImages: initialData?.interiorImages ?? [],
    exteriorImages: initialData?.exteriorImages ?? [],
    streetImages: initialData?.streetImages ?? [],
  })

  const { cities, lgas, states } = usePlaces({
    city: form.city,
    lga: form.lga,
    state: form.state,
    resetLga: () =>  updateField('lga', ''),
    resetCity: () => updateField('city', ''),
  })

  const [amenityInput, setAmenityInput] = useState("")

  const updateField = <K extends keyof CreatePropertyRequest>(key: K, value: CreatePropertyRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const addAmenity = () => {
    if (amenityInput.trim() && !form.amenities?.includes(amenityInput.trim())) {
      updateField("amenities", [...(form.amenities ?? []), amenityInput.trim()])
      setAmenityInput("")
    }
  }

  const removeAmenity = (amenity: string) => {
    updateField("amenities", form.amenities?.filter((a) => a !== amenity) ?? [])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} required minLength={3} maxLength={200} placeholder="e.g. Spacious 3-bedroom apartment in Lekki" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} required minLength={10} maxLength={5000} rows={5} placeholder="Describe the property..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select value={form.propertyType} onValueChange={(val) => val && updateField("propertyType", val as PropertyType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Listing Type</Label>
              <Select value={form.listingType} onValueChange={(val) => val && updateField("listingType", val as ListingType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={form.price || ""} onChange={(e) => updateField("price", Number(e.target.value))} required min={0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input id="bedrooms" type="number" value={form.bedrooms || ""} onChange={(e) => updateField("bedrooms", Number(e.target.value))} min={0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input id="bathrooms" type="number" value={form.bathrooms || ""} onChange={(e) => updateField("bathrooms", Number(e.target.value))} min={0} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 w-full">
              <Label>State</Label>
              <Select value={form.state} onValueChange={(val) => val && updateField("state", val)}>
                <SelectTrigger className={'w-full'}><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent className={'w-full'}>
                  {states.map((state) => (
                    <SelectItem key={state?.state} value={state?.state}>{state?.state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full">
              <Label>lgas</Label>
              <Select disabled={!form.state} value={form.lga} onValueChange={(val) => val && updateField("lga", val)}>
                <SelectTrigger className={'w-full'}><SelectValue placeholder="Select lga" /></SelectTrigger>
                <SelectContent className={'w-full'}>
                  {lgas.map((lga) => (
                    <SelectItem key={lga?.name} value={lga?.name}>{lga?.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full">
              <Label>City/Ward</Label>
              <Select value={form.city} disabled={!form.state || !form.lga} onValueChange={(val) => val && updateField("city", val)}>
                <SelectTrigger className={'w-full'}><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent className={'w-full'}>
                  {cities.map((city) => (
                    <SelectItem key={city?.name} value={city?.name}>{city?.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" disabled={!form.state || !form.city}  value={form.address} onChange={(e) => updateField("address", e.target.value)} required minLength={5} placeholder="Street address" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="e.g. Swimming Pool" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity() } }} />
            <Button type="button" variant="outline" onClick={addAmenity}>Add</Button>
          </div>
          {form.amenities && form.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.amenities.map((amenity) => (
                <span key={amenity} className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md text-sm">
                  {amenity}
                  <button type="button" onClick={() => removeAmenity(amenity)} className="text-muted-foreground hover:text-foreground ml-1">&times;</button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            value={form.proofOfOwnership}
            onChange={(urls) => updateField("proofOfOwnership", urls)}
            maxFiles={5}
            label="Proof of Ownership / Mandate Letter"
            required
            pathPrefix="properties/proof-of-ownership"
          />
          <ImageUpload
            value={form.interiorImages}
            onChange={(urls) => updateField("interiorImages", urls)}
            maxFiles={10}
            label="Interior Images"
            required
            pathPrefix="properties/interior"
          />
          <ImageUpload
            value={form.exteriorImages}
            onChange={(urls) => updateField("exteriorImages", urls)}
            maxFiles={10}
            label="Exterior Images"
            required
            pathPrefix="properties/exterior"
          />
          <ImageUpload
            value={form.streetImages ?? []}
            onChange={(urls) => updateField("streetImages", urls)}
            maxFiles={5}
            label="Street Sign / Nearby Landmarks"
            pathPrefix="properties/street"
          />
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  )
}
