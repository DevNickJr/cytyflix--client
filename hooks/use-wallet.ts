"use client"

import { useFetch } from "./use-fetch"
import { useMutationAction } from "./use-mutation"
import { walletService } from "@/services/wallet.service"
import type { WithdrawRequest, AddBeneficiaryRequest } from "@/types/wallet"

export function useWalletBalance() {
  return useFetch({
    queryKey: ["wallet"],
    queryFn: () => walletService.getBalance(),
  })
}

export function useBanks() {
  return useFetch({
    queryKey: ["banks"],
    queryFn: () => walletService.getBanks(),
    options: { staleTime: 1000 * 60 * 30 },
  })
}

export function useResolveAccount(accountNumber: string, bankCode: string) {
  const enabled = accountNumber.length === 10 && bankCode.length > 0
  return useFetch({
    queryKey: ["resolve-account", accountNumber, bankCode],
    queryFn: () => walletService.resolveAccount(accountNumber, bankCode),
    options: { enabled, retry: false },
  })
}

export function useBeneficiaries() {
  return useFetch({
    queryKey: ["beneficiaries"],
    queryFn: () => walletService.getBeneficiaries(),
  })
}

export function useAddBeneficiary() {
  return useMutationAction(
    (data: AddBeneficiaryRequest) => walletService.addBeneficiary(data),
    {
      successMessage: "Beneficiary added successfully",
      invalidateKeys: [["beneficiaries"]],
    }
  )
}

export function useDeleteBeneficiary() {
  return useMutationAction(
    (id: string) => walletService.deleteBeneficiary(id),
    {
      successMessage: "Beneficiary removed",
      invalidateKeys: [["beneficiaries"]],
    }
  )
}

export function useWalletTransactions(page = 1, limit = 10) {
  return useFetch({
    queryKey: ["wallet-transactions", page, limit],
    queryFn: () => walletService.getTransactions(page, limit),
  })
}

export function useWithdraw() {
  return useMutationAction(
    (data: WithdrawRequest) => walletService.withdraw(data),
    {
      successMessage: "Withdrawal request submitted successfully",
      invalidateKeys: [["wallet"], ["wallet-transactions"]],
    }
  )
}
