"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useAgreement, useSignAsLandlord, useSignAsTenant } from "@/hooks/use-tenancy-agreements"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES, API_URL } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/shared/loading-spinner"
import { SignaturePad } from "@/components/shared/signature-pad"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  PenTool,
} from "lucide-react"
import { AgreementStatus } from "@/types/tenancy-agreement"

const STATUS_LABEL: Record<string, string> = {
  [AgreementStatus.DRAFT]: "Draft",
  [AgreementStatus.PENDING_TENANT]: "Awaiting Tenant Signature",
  [AgreementStatus.PENDING_LANDLORD]: "Awaiting Landlord Signature",
  [AgreementStatus.SIGNED]: "Fully Signed",
  [AgreementStatus.EXPIRED]: "Expired",
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [AgreementStatus.DRAFT]: "secondary",
  [AgreementStatus.PENDING_TENANT]: "outline",
  [AgreementStatus.PENDING_LANDLORD]: "outline",
  [AgreementStatus.SIGNED]: "default",
  [AgreementStatus.EXPIRED]: "destructive",
}

export default function AgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { data, isLoading } = useAgreement(id)
  const signAsLandlord = useSignAsLandlord()
  const signAsTenant = useSignAsTenant()

  if (isLoading) return <PageLoader />

  const agreement = data?.data
  if (!agreement) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Agreement Not Found</h1>
        <Button onClick={() => router.push(ROUTES.DASHBOARD_TENANCY_AGREEMENTS)}>
          Back to Agreements
        </Button>
      </div>
    )
  }

  const isLandlord = user?.id === agreement.landlordId
  const isTenant = user?.id === agreement.tenantId
  const isSigned = agreement.status === AgreementStatus.SIGNED

  const needsLandlordSignature = isLandlord && !agreement.landlordSignature
  const needsTenantSignature = isTenant && !agreement.tenantSignature

  const handleLandlordSign = (signatureUrl: string) => {
    signAsLandlord.mutate({ id: agreement.id, data: { signatureUrl } })
  }

  const handleTenantSign = (signatureUrl: string) => {
    signAsTenant.mutate({ id: agreement.id, data: { signatureUrl } })
  }

  const downloadUrl = `${API_URL}/tenancy-agreements/${agreement.id}/download`

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tenancy Agreement</CardTitle>
            <Badge variant={STATUS_VARIANT[agreement.status]}>
              {STATUS_LABEL[agreement.status] || agreement.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(agreement.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="font-medium">{isLandlord ? "Landlord" : "Tenant"}</p>
            </div>
          </div>

          <Separator />

          {/* Agreement Content */}
          <div className="space-y-2">
            <h3 className="font-semibold">Agreement Content</h3>
            <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {agreement.agreementContent}
              </pre>
            </div>
          </div>

          <Separator />

          {/* Signatures */}
          <div className="space-y-4">
            <h3 className="font-semibold">Signatures</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Landlord signature */}
              <div className="border rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Landlord</p>
                {agreement.landlordSignature ? (
                  <>
                    <img
                      src={agreement.landlordSignature}
                      alt="Landlord signature"
                      className="h-20 border rounded bg-white"
                    />
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Signed {agreement.landlordSignedAt && formatDate(agreement.landlordSignedAt)}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Not yet signed
                  </div>
                )}
              </div>

              {/* Tenant signature */}
              <div className="border rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Tenant</p>
                {agreement.tenantSignature ? (
                  <>
                    <img
                      src={agreement.tenantSignature}
                      alt="Tenant signature"
                      className="h-20 border rounded bg-white"
                    />
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Signed {agreement.tenantSignedAt && formatDate(agreement.tenantSignedAt)}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Not yet signed
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sign section */}
          {needsLandlordSignature && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  <h3 className="font-semibold">Sign as Landlord</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Draw your signature below to sign this agreement.
                </p>
                <SignaturePad
                  onSave={handleLandlordSign}
                  disabled={signAsLandlord.isPending}
                />
              </div>
            </>
          )}

          {needsTenantSignature && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  <h3 className="font-semibold">Sign as Tenant</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  By signing, you agree to the terms of this tenancy agreement.
                </p>
                <SignaturePad
                  onSave={handleTenantSign}
                  disabled={signAsTenant.isPending}
                />
              </div>
            </>
          )}

          {/* Fully signed banner */}
          {isSigned && (
            <>
              <Separator />
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                <p className="text-green-800 dark:text-green-200">
                  This agreement has been signed by both parties.
                </p>
              </div>
            </>
          )}

          {/* Download button */}
          <Separator />
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.open(downloadUrl, "_blank")}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
