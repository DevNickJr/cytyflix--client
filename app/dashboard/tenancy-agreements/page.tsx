"use client"

import { useMyAgreements } from "@/hooks/use-tenancy-agreements"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES, OWNER_ROLES } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { PageLoader } from "@/components/shared/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"
import type { TenancyAgreement } from "@/types/tenancy-agreement"
import { AgreementStatus } from "@/types/tenancy-agreement"

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [AgreementStatus.DRAFT]: "secondary",
  [AgreementStatus.PENDING_TENANT]: "outline",
  [AgreementStatus.PENDING_LANDLORD]: "outline",
  [AgreementStatus.SIGNED]: "default",
  [AgreementStatus.EXPIRED]: "destructive",
}

const STATUS_LABEL: Record<string, string> = {
  [AgreementStatus.DRAFT]: "Draft",
  [AgreementStatus.PENDING_TENANT]: "Awaiting Tenant",
  [AgreementStatus.PENDING_LANDLORD]: "Awaiting Landlord",
  [AgreementStatus.SIGNED]: "Signed",
  [AgreementStatus.EXPIRED]: "Expired",
}

function AgreementCard({ agreement }: { agreement: TenancyAgreement }) {
  return (
    <Link href={ROUTES.DASHBOARD_TENANCY_AGREEMENT_DETAIL(agreement.id)}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={STATUS_BADGE[agreement.status]}>
                  {STATUS_LABEL[agreement.status] || agreement.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                {agreement.agreementContent.slice(0, 120)}...
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">{formatDate(agreement.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function TenancyAgreementsPage() {
  const { user } = useAuth()
  const { data, isLoading } = useMyAgreements()
  const isOwner = user && OWNER_ROLES.includes(user.role)

  if (isLoading) return <PageLoader />

  const agreements = data?.data || []

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tenancy Agreements</h1>
          <p className="text-muted-foreground mt-1">
            Manage your digital tenancy agreements
          </p>
        </div>
        {isOwner && (
          <Link href={ROUTES.DASHBOARD_NEW_TENANCY_AGREEMENT}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Agreement
            </Button>
          </Link>
        )}
      </div>

      {agreements.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-1">No agreements yet</h3>
            <p className="text-sm text-muted-foreground">
              {isOwner
                ? "Create a tenancy agreement for your tenants."
                : "Agreements from landlords will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {agreements.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))}
        </div>
      )}
    </div>
  )
}
