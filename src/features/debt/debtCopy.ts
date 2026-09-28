import type { DebtAction, DebtType, DebtWithBalance } from "@/types/debt"
import type { TransactionDirection } from "@/types/transactions"
import { formatINR } from "@/utils/dateCurrencyUtils"

export function debtDirection(debtType: DebtType, action: DebtAction): TransactionDirection {
  const increases = action === "increase"
  if (debtType === "borrowed") return increases ? "inflow" : "outflow"
  return increases ? "outflow" : "inflow"
}

export function debtActionLabel(debtType: DebtType, action: DebtAction) {
  if (debtType === "borrowed") {
    return action === "increase" ? "Borrowed more" : "Paid back"
  }
  return action === "increase" ? "Lent more" : "Got paid back"
}

export function debtSideLabel(debtType: DebtType) {
  return debtType === "borrowed" ? "I owe" : "Owed to me"
}

export function remainingLabel(debt: DebtWithBalance) {
  if (debt.remaining === 0) return "settled"
  if (debt.debtType === "borrowed") {
    return debt.remaining > 0 ? "still owed" : "overpaid"
  }
  return debt.remaining > 0 ? "still to receive" : "received extra"
}

export function describeDebts(debts: DebtWithBalance[]) {
  if (!debts.length) return "Who you owe, and who owes you."

  const owe = debts
    .filter((debt) => debt.debtType === "borrowed")
    .reduce((sum, debt) => sum + Math.max(debt.remaining, 0), 0)
  const owed = debts
    .filter((debt) => debt.debtType === "lent")
    .reduce((sum, debt) => sum + Math.max(debt.remaining, 0), 0)

  const sentences: string[] = []
  if (owe > 0) sentences.push(`${formatINR(owe)} still to pay`)
  if (owed > 0) sentences.push(`${formatINR(owed)} still to receive`)
  if (!sentences.length) return "Everything here is settled."

  return `${sentences.join(". ")}.`
}

export function debtLineTitle(
  debtType: DebtType | null,
  direction: string | null,
  name: string | null,
) {
  if (!name) return "Debt"
  if (debtType === "borrowed") {
    return direction === "inflow" ? `Borrowed from ${name}` : `Paid back to ${name}`
  }
  if (debtType === "lent") {
    return direction === "outflow" ? `Lent to ${name}` : `Received from ${name}`
  }
  return direction === "outflow" ? `Paid to ${name}` : `Received from ${name}`
}
