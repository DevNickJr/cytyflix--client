"use client"

import { useState } from "react"
import { PropertyType, ListingType, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS, NIGERIAN_STATES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { CreatePropertyRequest, Property } from "@/types/property"

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
    state: initialData?.state ?? "",
    country: initialData?.country ?? "Nigeria",
    bedrooms: initialData?.bedrooms ?? 1,
    bathrooms: initialData?.bathrooms ?? 1,
    amenities: initialData?.amenities ?? [],
    images: initialData?.images ?? [],
  })

  const [amenityInput, setAmenityInput] = useState("")
  const [imageInput, setImageInput] = useState("")

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

  const addImage = () => {
    if (imageInput.trim()) {
      updateField("images", [...(form.images ?? []), imageInput.trim()])
      setImageInput("")
    }
  }

  const removeImage = (url: string) => {
    updateField("images", form.images?.filter((i) => i !== url) ?? [])
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
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} required minLength={5} placeholder="Street address" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State</Label>
              <Select value={form.state} onValueChange={(val) => val && updateField("state", val)}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} required placeholder="e.g. Lagos" />
            </div>
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
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="Image URL" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage() } }} />
            <Button type="button" variant="outline" onClick={addImage}>Add</Button>
          </div>
          {form.images && form.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {form.images.map((url) => (
                <div key={url} className="relative group aspect-video bg-muted rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  )
}
