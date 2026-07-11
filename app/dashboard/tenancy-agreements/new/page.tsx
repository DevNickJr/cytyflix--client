"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMyProperties } from "@/hooks/use-properties"
import { useCreateAgreement } from "@/hooks/use-tenancy-agreements"
import { ROUTES } from "@/lib/constants"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

const DEFAULT_TEMPLATE = `TENANCY AGREEMENT

This Tenancy Agreement ("Agreement") is entered into on the date of signing.

BETWEEN:

LANDLORD: [Landlord Name]
(hereinafter referred to as "the Landlord")

AND

TENANT: [Tenant Name]
(hereinafter referred to as "the Tenant")

TERMS AND CONDITIONS:

1. GRANT OF TENANCY
The Landlord hereby grants to the Tenant a tenancy of the above-described property for residential purposes.

2. RENT
The Tenant shall pay the agreed rent amount promptly when due. Payment shall be made through the CytyFlix platform.

3. DURATION
This tenancy shall be for a period as agreed between the parties, subject to the terms herein.

4. USE OF PROPERTY
The Tenant shall use the property solely for residential purposes and shall not sublet or assign the property without the Landlord's prior written consent.

5. MAINTENANCE
The Tenant shall keep the property in good and tenantable condition and shall be responsible for minor repairs. The Landlord shall be responsible for major structural repairs.

6. UTILITIES
The Tenant shall be responsible for payment of all utilities including electricity, water, and waste disposal during the tenancy period.

7. INSPECTION
The Landlord or their agent may inspect the property upon giving reasonable notice to the Tenant.

8. TERMINATION
Either party may terminate this agreement by giving adequate notice as required by applicable Nigerian tenancy law.

9. RETURN OF PROPERTY
Upon termination, the Tenant shall return the property in the same condition as received, fair wear and tear excepted.

10. GOVERNING LAW
This Agreement shall be governed by the laws of the Federal Republic of Nigeria and the applicable state tenancy laws.

AGREED AND SIGNED BY BOTH PARTIES THROUGH THE CYTYFLIX PLATFORM.`

export default function NewAgreementPage() {
  const router = useRouter()
  const { data: propertiesData, isLoading: loadingProperties } = useMyProperties(1, 100)
  const createAgreement = useCreateAgreement()

  const [propertyId, setPropertyId] = useState("")
  const [tenantEmail, setTenantEmail] = useState("")
  const [agreementContent, setAgreementContent] = useState(DEFAULT_TEMPLATE)

  if (loadingProperties) return <PageLoader />

  const properties = propertiesData?.data || []

  const handleSubmit = async () => {
    if (!propertyId) {
      toast.error("Please select a property")
      return
    }
    if (!tenantEmail) {
      toast.error("Please enter the tenant's user ID")
      return
    }
    if (agreementContent.length < 50) {
      toast.error("Agreement content must be at least 50 characters")
      return
    }

    try {
      await createAgreement.mutateAsync({
        propertyId,
        tenantId: tenantEmail,
        agreementContent,
      })
      router.push(ROUTES.DASHBOARD_TENANCY_AGREEMENTS)
    } catch {
      // Error handled by mutation hook
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Create Tenancy Agreement</h1>
        <p className="text-muted-foreground mt-1">
          Create a new digital tenancy agreement for your tenant to review and sign.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agreement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property">Property</Label>
            <select
              id="property"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.address}, {p.city}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant-id">Tenant User ID</Label>
            <Input
              id="tenant-id"
              value={tenantEmail}
              onChange={(e) => setTenantEmail(e.target.value)}
              placeholder="Enter tenant's user ID (UUID)"
            />
            <p className="text-xs text-muted-foreground">
              The tenant&apos;s user ID can be shared by the tenant from their profile page.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agreement-content">Agreement Content</Label>
            <Textarea
              id="agreement-content"
              value={agreementContent}
              onChange={(e) => setAgreementContent(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Edit the template above to suit your specific agreement terms.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={createAgreement.isPending}
            className="gap-2"
          >
            {createAgreement.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create & Send to Tenant
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
