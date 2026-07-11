export enum AgreementStatus {
  DRAFT = "draft",
  PENDING_TENANT = "pending_tenant",
  PENDING_LANDLORD = "pending_landlord",
  SIGNED = "signed",
  EXPIRED = "expired",
}

export interface TenancyAgreement {
  id: string
  propertyId: string
  landlordId: string
  tenantId: string
  agreementContent: string
  landlordSignature: string | null
  tenantSignature: string | null
  landlordSignedAt: string | null
  tenantSignedAt: string | null
  status: AgreementStatus
  createdAt: string
  updatedAt: string
}

export interface CreateAgreementRequest {
  propertyId: string
  tenantId: string
  agreementContent: string
}

export interface SignAgreementRequest {
  signatureUrl: string
}
