export interface Wallet {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: string
  amount: number
  balanceAfter: number
  status: string
  reference: string
  description: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface Bank {
  id: number
  name: string
  slug: string
  code: string
  type: string
  currency: string
}

export interface Beneficiary {
  id: string
  userId: string
  bankCode: string
  bankName: string
  accountNumber: string
  accountName: string
  recipientCode: string
  createdAt: string
}

export interface ResolvedAccount {
  accountName: string
  accountNumber: string
}

export interface AddBeneficiaryRequest {
  bankCode: string
  bankName: string
  accountNumber: string
  accountName: string
}

export interface WithdrawRequest {
  amount: number
  beneficiaryId?: string
  bankCode?: string
  accountNumber?: string
  accountName?: string
}
