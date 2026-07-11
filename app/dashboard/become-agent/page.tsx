"use client"

import { useState } from "react"
import { useMyVerification, useSubmitVerification } from "@/hooks/use-agent-verification"
import { useAuth } from "@/hooks/use-auth"
import { ImageUpload } from "@/components/shared/image-upload"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldCheck, Clock, XCircle } from "lucide-react"

export default function BecomeAgentPage() {
  const { user } = useAuth()
  const { data, isLoading } = useMyVerification()
  const submitMutation = useSubmitVerification()
  const [idDocumentUrls, setIdDocumentUrls] = useState<string[]>([])
  const [selfieUrls, setSelfieUrls] = useState<string[]>([])
  const [utilityBillUrls, setUtilityBillUrls] = useState<string[]>([])
  const [ninNumber, setNinNumber] = useState("")

  if (isLoading) return <PageLoader />

  const verification = data?.data

  if (user?.role === "agent") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2">You are a Verified Agent</h2>
            <p className="text-muted-foreground">
              Your account has been verified. You can list properties and accept bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verification?.status === "pending") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">Verification Pending</h2>
            <Badge variant="secondary" className="mb-4">Pending Review</Badge>
            <p className="text-muted-foreground">
              Your verification documents have been submitted and are awaiting admin review.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (idDocumentUrls.length === 0 || selfieUrls.length === 0 || utilityBillUrls.length === 0) return
    await submitMutation.mutateAsync({
      idDocumentUrl: idDocumentUrls[0],
      selfieUrl: selfieUrls[0],
      utilityBillUrl: utilityBillUrls[0],
      ninNumber: ninNumber.trim() || undefined,
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Become an Agent</h1>
        <p className="text-muted-foreground mt-1">
          Upload your government-issued ID and a selfie to get verified as an agent.
        </p>
      </div>

      {verification?.status === "rejected" && (
        <Card className="border-destructive">
          <CardContent className="p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Previous application rejected</p>
              <p className="text-sm text-muted-foreground">
                {verification.rejectionReason || "No reason provided"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Government-Issued ID</CardTitle>
          <CardDescription>
            Upload a clear photo of your NIN card, voters card, drivers license, or international passport.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={idDocumentUrls}
            onChange={setIdDocumentUrls}
            maxFiles={1}
            label="ID Document"
            required
            pathPrefix="verifications/id-documents"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selfie Photo</CardTitle>
          <CardDescription>
            Upload a clear selfie of yourself. This will be compared to your ID document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={selfieUrls}
            onChange={setSelfieUrls}
            maxFiles={1}
            label="Selfie"
            required
            pathPrefix="verifications/selfies"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utility Bill</CardTitle>
          <CardDescription>
            Upload a recent utility bill (electricity, water, or waste) to verify your address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={utilityBillUrls}
            onChange={setUtilityBillUrls}
            maxFiles={1}
            label="Utility Bill"
            required
            pathPrefix="verifications/utility-bills"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Virtual NIN Verification</CardTitle>
          <CardDescription>
            Enter your 16-character Virtual NIN (vNIN) from the NIMC mobile app. This will be verified in real-time against the national identity database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="ninNumber">Virtual NIN (vNIN)</Label>
            <Input
              id="ninNumber"
              value={ninNumber}
              onChange={(e) => setNinNumber(e.target.value.toUpperCase())}
              placeholder="e.g. AB12345678901234"
              maxLength={16}
            />
            <p className="text-xs text-muted-foreground">
              Generate your vNIN from the NIMC mobile app. It is a 16-character alphanumeric code.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={submitMutation.isPending || idDocumentUrls.length === 0 || selfieUrls.length === 0 || utilityBillUrls.length === 0}
      >
        {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Verification
      </Button>
    </div>
  )
}
