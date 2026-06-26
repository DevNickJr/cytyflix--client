import { apiClient } from "@/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { Wallet, WalletTransaction, WithdrawRequest, Bank, Beneficiary, AddBeneficiaryRequest, ResolvedAccount } from "@/types/wallet"

export const walletService = {
  async getBalance() {
    return apiClient.get<ApiResponse<Wallet>>("/wallets")
  },

  async getTransactions(page = 1, limit = 10) {
    return apiClient.get<PaginatedResponse<WalletTransaction>>("/wallets/transactions", { page, limit })
  },

  async getBanks() {
    return apiClient.get<ApiResponse<Bank[]>>("/wallets/banks")
  },

  async resolveAccount(accountNumber: string, bankCode: string) {
    return apiClient.get<ApiResponse<ResolvedAccount>>("/wallets/resolve-account", {
      account_number: accountNumber,
      bank_code: bankCode,
    })
  },

  async getBeneficiaries() {
    return apiClient.get<ApiResponse<Beneficiary[]>>("/wallets/beneficiaries")
  },

  async addBeneficiary(data: AddBeneficiaryRequest) {
    return apiClient.post<ApiResponse<Beneficiary>>("/wallets/beneficiaries", data)
  },

  async deleteBeneficiary(id: string) {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/wallets/beneficiaries/${id}`)
  },

  async withdraw(data: WithdrawRequest) {
    return apiClient.post<ApiResponse<WalletTransaction>>("/wallets/withdraw", data)
  },
}
