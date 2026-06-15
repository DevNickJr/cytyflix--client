"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useMutationAction } from "@/hooks/use-mutation"
import { userService } from "@/services/user.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { UpdateProfileRequest } from "@/types/user"

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState<UpdateProfileRequest>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: "",
    preferredLocation: "",
    budgetMin: undefined,
    budgetMax: undefined,
    profileImage: "",
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
      })
    }
  }, [user])

  const updateProfile = useMutationAction(
    (data: UpdateProfileRequest) => userService.updateProfile(data),
    {
      successMessage: "Profile updated successfully",
      onSuccess: () => refreshUser(),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(form)
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
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input id="profileImage" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} placeholder="https://..." />
            </div>
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

        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  )
}
