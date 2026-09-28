import type { DebtAction, DebtType } from "@/types/debt"
import type { TransactionWithRef } from "@/types/transactions"
import { formatINR } from "@/utils/dateCurrencyUtils"
import { debtLineTitle } from "../debt/debtCopy"

export type EntryKind = "spent" | "received" | "debt"

export function entryKind(transaction: TransactionWithRef | null): EntryKind {
  if (!transaction || transaction.transactionType === "debt") {
    return transaction ? "debt" : "spent"
  }
  return transaction.direction === "inflow" ? "received" : "spent"
}

export function debtActionOf(
  debtType: DebtType | null | undefined,
  direction: string | null | undefined,
): DebtAction {
  const increases =
    (debtType === "borrowed" && direction === "inflow") ||
    (debtType === "lent" && direction === "outflow")
  return increases ? "increase" : "decrease"
}

export function lineTitle(transaction: TransactionWithRef) {
  if (transaction.transactionType === "debt") {
    return debtLineTitle(transaction.debtType, transaction.direction, transaction.counterparty)
  }
  return transaction.categoryName || "Transaction"
}

export function signedAmount(amount: number, direction: string | null) {
  const formatted = formatINR(Math.abs(amount))
  if (direction === "outflow") return `−${formatted}`
  if (direction === "inflow") return `+${formatted}`
  return formatted
}
