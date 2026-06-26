"use client"

import { useState, useEffect } from "react"
import { useWalletBalance, useWalletTransactions, useWithdraw, useBanks, useBeneficiaries, useAddBeneficiary, useDeleteBeneficiary, useResolveAccount } from "@/hooks/use-wallet"
import { TransactionType, TransactionStatus } from "@/lib/constants"
import { formatPrice, formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination } from "@/components/shared/pagination"
import { PageLoader } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Beneficiary } from "@/types/wallet"
import { ArrowDownCircle, ArrowUpCircle, Receipt, Loader2, Plus, Trash2 } from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
  [TransactionStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [TransactionStatus.COMPLETED]: "bg-green-100 text-green-800",
  [TransactionStatus.FAILED]: "bg-red-100 text-red-800",
}

export default function WalletPage() {
  const [page, setPage] = useState(1)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const { data: walletData, isLoading: walletLoading } = useWalletBalance()
  const { data: txData, isLoading: txLoading } = useWalletTransactions(page)

  if (walletLoading) return <PageLoader />

  const wallet = walletData?.data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Wallet</h1>
        <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
      </div>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-3xl font-bold">{formatPrice(wallet?.balance ?? 0)}</p>
          </div>
          <Button onClick={() => setWithdrawOpen(true)}>
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {txLoading ? (
          <PageLoader />
        ) : txData?.data?.length ? (
          <div className="space-y-3">
            {txData.data.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {tx.type === TransactionType.CREDIT ? (
                        <ArrowDownCircle className="h-4 w-4 text-green-600 shrink-0" />
                      ) : (
                        <ArrowUpCircle className="h-4 w-4 text-red-600 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{tx.reference}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold ${tx.type === TransactionType.CREDIT ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === TransactionType.CREDIT ? "+" : "-"}{formatPrice(tx.amount)}
                      </p>
                      <Badge className={STATUS_COLORS[tx.status] ?? ""}>{tx.status}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                </CardContent>
              </Card>
            ))}
            {txData.totalPages > 1 && (
              <div className="mt-4">
                <Pagination page={page} totalPages={txData.totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Your transaction history will appear here once you start receiving payments."
          />
        )}
      </div>

      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </div>
  )
}

function WithdrawDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const withdraw = useWithdraw()
  const { data: beneficiariesData } = useBeneficiaries()
  const [amount, setAmount] = useState("")
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState("")
  const [showNewAccount, setShowNewAccount] = useState(false)

  const beneficiaries = beneficiariesData?.data ?? []
  const hasBeneficiaries = beneficiaries.length > 0

  const isValid = Number(amount) > 0 && (selectedBeneficiaryId || showNewAccount)

  const resetForm = () => {
    setAmount("")
    setSelectedBeneficiaryId("")
    setShowNewAccount(false)
  }

  const handleSubmit = async () => {
    const numAmount = Number(amount)
    if (!numAmount || !selectedBeneficiaryId) return
    await withdraw.mutateAsync({ amount: numAmount, beneficiaryId: selectedBeneficiaryId })
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className={showNewAccount ? undefined : "sm:max-w-md"}>
        {showNewAccount ? (
          <NewAccountForm
            onBack={() => setShowNewAccount(false)}
            onAdded={(b) => { setSelectedBeneficiaryId(b.id); setShowNewAccount(false) }}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Withdraw to</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary"
                    onClick={() => setShowNewAccount(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add new account
                  </Button>
                </div>
                {hasBeneficiaries ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {beneficiaries.map((b) => (
                      <BeneficiaryCard
                        key={b.id}
                        beneficiary={b}
                        selected={selectedBeneficiaryId === b.id}
                        onSelect={() => setSelectedBeneficiaryId(b.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-3 text-center">
                    No saved accounts. Add one to get started.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={withdraw.isPending || !isValid || !selectedBeneficiaryId}
              >
                {withdraw.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Withdraw
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function BeneficiaryCard({ beneficiary, selected, onSelect }: {
  beneficiary: Beneficiary
  selected: boolean
  onSelect: () => void
}) {
  const deleteBeneficiary = useDeleteBeneficiary()

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-lg border p-3 transition-colors ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{beneficiary.accountName}</p>
          <p className="text-xs text-muted-foreground">
            {beneficiary.bankName} &middot; {beneficiary.accountNumber}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            deleteBeneficiary.mutate(beneficiary.id)
          }}
          disabled={deleteBeneficiary.isPending}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </button>
  )
}

function NewAccountForm({ onBack, onAdded }: {
  onBack: () => void
  onAdded: (beneficiary: Beneficiary) => void
}) {
  const addBeneficiary = useAddBeneficiary()
  const { data: banksData, isLoading: banksLoading } = useBanks()
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")

  const banks = banksData?.data ?? []
  const selectedBank = banks.find((b) => b.code === bankCode)

  const { data: resolvedData, isLoading: resolving, isError: resolveFailed } = useResolveAccount(accountNumber, bankCode)

  useEffect(() => {
    if (resolvedData?.data?.accountName) {
      setAccountName(resolvedData.data.accountName)
    }
  }, [resolvedData])

  const handleAdd = async () => {
    if (!bankCode || !accountNumber || !accountName || !selectedBank) return
    const result = await addBeneficiary.mutateAsync({
      bankCode,
      bankName: selectedBank.name,
      accountNumber,
      accountName,
    })
    onAdded(result.data)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Bank Account</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Bank</Label>
          <Select
            value={bankCode}
            onValueChange={(val) => {
              if (val) {
                setBankCode(val)
                setAccountName("")
              }
            }}
            disabled={banksLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={banksLoading ? "Loading banks..." : "Select a bank"} />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.code} value={bank.code}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Account Number</Label>
          <Input
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value)
              setAccountName("")
            }}
            maxLength={10}
          />
        </div>
        <div className="space-y-2">
          <Label>Account Name</Label>
          {resolving ? (
            <div className="flex items-center gap-2 h-9 px-3 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Verifying account...
            </div>
          ) : (
            <>
              <Input
                placeholder={resolveFailed ? "Could not resolve - enter manually" : "Auto-filled from bank"}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                readOnly={!!resolvedData?.data?.accountName && accountName === resolvedData.data.accountName}
              />
              {resolveFailed && accountNumber.length === 10 && bankCode && (
                <p className="text-xs text-destructive">Could not verify this account. You can still enter the name manually.</p>
              )}
            </>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          onClick={handleAdd}
          disabled={addBeneficiary.isPending || resolving || !bankCode || !accountNumber || !accountName}
        >
          {addBeneficiary.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Account
        </Button>
      </DialogFooter>
    </>
  )
}
