"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useMutationAction } from "@/hooks/use-mutation"
import { usePlaces } from "@/hooks/usePlaces"
import { userService } from "@/services/user.service"
import { ROUTES, RolesEnum } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, X, ExternalLink } from "lucide-react"
import type { UpdateProfileRequest } from "@/types/user"
import { ImageUpload } from "@/components/shared/image-upload"

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [profileId, setProfileId] = useState<string[]>([])
  const [form, setForm] = useState<UpdateProfileRequest>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: "",
    preferredLocation: "",
    budgetMin: undefined,
    budgetMax: undefined,
    profileImage: "",
    operatingStates: [],
    operatingLgas: [],
    operatingCities: [],
  })

  const [slugInput, setSlugInput] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedLga, setSelectedLga] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const { states, lgas, cities } = usePlaces({
    state: selectedState,
    lga: selectedLga,
    city: selectedCity,
    resetLga: () => setSelectedLga(""),
    resetCity: () => setSelectedCity(""),
  })

  useEffect(() => {
    if (user?.profile) {
      setForm({
        firstName: user.profile.firstName ?? "",
        lastName: user.profile.lastName ?? "",
        phoneNumber: user.profile.phoneNumber ?? "",
        bio: user.profile.bio ?? "",
        preferredLocation: user.profile.preferredLocation ?? "",
        budgetMin: user.profile.budgetMin ?? undefined,
        budgetMax: user.profile.budgetMax ?? undefined,
        profileImage: user.profile.profileImage ?? "",
        operatingStates: user.profile.operatingStates ?? [],
        operatingLgas: user.profile.operatingLgas ?? [],
        operatingCities: user.profile.operatingCities ?? [],
      })
      setSlugInput(user.profile.slug ?? "")
    }
  }, [user])

  const updateProfile = useMutationAction(
    (data: UpdateProfileRequest) => userService.updateProfile(data),
    {
      successMessage: "Profile updated successfully",
      onSuccess: () => refreshUser(),
    }
  )

  const updateSlug = useMutationAction(
    (slug: string) => userService.updateSlug(slug),
    {
      successMessage: "Slug updated successfully",
      onSuccess: () => refreshUser(),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate({
      ...form,
      profileImage: profileId[0],
    })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-1">Profile</h1>
      <p className="text-muted-foreground mb-8">Manage your account details and preferences</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your name and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+234..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={500} placeholder="Tell us about yourself..." />
            </div>
            <Card>
              <CardContent>
                <ImageUpload
                  value={profileId}
                  onChange={setProfileId}
                  maxFiles={1}
                  label="Profile Image"
                  pathPrefix="/profile"
                />
              </CardContent>
            </Card>
            {/* <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input id="profileImage" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} placeholder="https://..." />
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Help us show you relevant properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredLocation">Preferred Location</Label>
              <Input id="preferredLocation" value={form.preferredLocation} onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })} placeholder="e.g. Lagos, Abuja" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Minimum Budget</Label>
                <Input id="budgetMin" type="number" value={form.budgetMin ?? ""} onChange={(e) => setForm({ ...form, budgetMin: e.target.value ? Number(e.target.value) : undefined })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Maximum Budget</Label>
                <Input id="budgetMax" type="number" value={form.budgetMax ?? ""} onChange={(e) => setForm({ ...form, budgetMax: e.target.value ? Number(e.target.value) : undefined })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {user?.role === RolesEnum.AGENT && (
          <>
          <Card>
            <CardHeader>
              <CardTitle>Agent Profile URL</CardTitle>
              <CardDescription>Customize your public profile slug and view your agent page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Profile Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={slugInput}
                    onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="john-doe"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateSlug.isPending || !slugInput || slugInput === user?.profile?.slug}
                    onClick={() => updateSlug.mutate(slugInput)}
                  >
                    {updateSlug.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your public profile will be available at <code>/agents/{slugInput || user?.profile?.slug || "your-slug"}</code>
                </p>
              </div>
              {(user?.profile?.slug || user?.id) && (
                <Link
                  href={ROUTES.AGENT_DETAIL(user.profile?.slug || user.id)}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View My Agent Page
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Locations</CardTitle>
              <CardDescription>States, LGAs, and cities you operate in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* States */}
              <div className="space-y-2">
                <Label>States</Label>
                <div className="flex gap-2">
                  <Select value={selectedState} onValueChange={(val) => val && setSelectedState(val)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={() => {
                    if (selectedState && !form.operatingStates?.includes(selectedState)) {
                      setForm({ ...form, operatingStates: [...(form.operatingStates ?? []), selectedState] })
                    }
                  }}>Add</Button>
                </div>
                {form.operatingStates && form.operatingStates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.operatingStates.map((state) => (
                      <Badge key={state} variant="secondary" className="gap-1">
                        {state}
                        <button type="button" onClick={() => setForm({ ...form, operatingStates: form.operatingStates?.filter((s) => s !== state) ?? [] })} className="text-muted-foreground hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* LGAs */}
              <div className="space-y-2">
                <Label>LGAs</Label>
                <div className="flex gap-2">
                  <Select value={selectedState} onValueChange={(val) => val && setSelectedState(val)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select disabled={!selectedState} value={selectedLga} onValueChange={(val) => val && setSelectedLga(val)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select LGA" /></SelectTrigger>
                    <SelectContent>
                      {lgas.map((l) => (
                        <SelectItem key={l.name} value={l.name}>{l.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={() => {
                    if (selectedLga && !form.operatingLgas?.includes(selectedLga)) {
                      setForm({ ...form, operatingLgas: [...(form.operatingLgas ?? []), selectedLga] })
                    }
                  }}>Add</Button>
                </div>
                {form.operatingLgas && form.operatingLgas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.operatingLgas.map((lga) => (
                      <Badge key={lga} variant="secondary" className="gap-1">
                        {lga}
                        <button type="button" onClick={() => setForm({ ...form, operatingLgas: form.operatingLgas?.filter((l) => l !== lga) ?? [] })} className="text-muted-foreground hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Cities */}
              <div className="space-y-2">
                <Label>Cities</Label>
                <div className="flex gap-2">
                  <Select value={selectedState} onValueChange={(val) => val && setSelectedState(val)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select disabled={!selectedState} value={selectedLga} onValueChange={(val) => val && setSelectedLga(val)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select LGA" /></SelectTrigger>
                    <SelectContent>
                      {lgas.map((l) => (
                        <SelectItem key={l.name} value={l.name}>{l.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select disabled={!selectedState || !selectedLga} value={selectedCity} onValueChange={(val) => val && setSelectedCity(val)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={() => {
                    if (selectedCity && !form.operatingCities?.includes(selectedCity)) {
                      setForm({ ...form, operatingCities: [...(form.operatingCities ?? []), selectedCity] })
                    }
                  }}>Add</Button>
                </div>
                {form.operatingCities && form.operatingCities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.operatingCities.map((city) => (
                      <Badge key={city} variant="secondary" className="gap-1">
                        {city}
                        <button type="button" onClick={() => setForm({ ...form, operatingCities: form.operatingCities?.filter((c) => c !== city) ?? [] })} className="text-muted-foreground hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </>
        )}

        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  )
}
