"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { tenancyAgreementService } from "@/services/tenancy-agreement.service"
import type { CreateAgreementRequest, SignAgreementRequest } from "@/types/tenancy-agreement"

export function useMyAgreements(page = 1, limit = 20) {
  return useFetch({
    queryKey: ["tenancy-agreements", page, limit],
    queryFn: () => tenancyAgreementService.getMyAgreements(page, limit),
  })
}

export function useAgreement(id: string) {
  return useFetch({
    queryKey: ["tenancy-agreement", id],
    queryFn: () => tenancyAgreementService.getAgreement(id),
    options: { enabled: !!id },
  })
}

export function useCreateAgreement() {
  return useMutationAction(
    (data: CreateAgreementRequest) => tenancyAgreementService.createAgreement(data),
    {
      successMessage: "Tenancy agreement created and sent to tenant.",
      invalidateKeys: [["tenancy-agreements"]],
    },
  )
}

export function useSignAsLandlord() {
  return useMutationAction(
    ({ id, data }: { id: string; data: SignAgreementRequest }) =>
      tenancyAgreementService.signAsLandlord(id, data),
    {
      successMessage: "Agreement signed as landlord.",
      invalidateKeys: [["tenancy-agreements"], ["tenancy-agreement"]],
    },
  )
}

export function useSignAsTenant() {
  return useMutationAction(
    ({ id, data }: { id: string; data: SignAgreementRequest }) =>
      tenancyAgreementService.signAsTenant(id, data),
    {
      successMessage: "Agreement signed as tenant.",
      invalidateKeys: [["tenancy-agreements"], ["tenancy-agreement"]],
    },
  )
}
