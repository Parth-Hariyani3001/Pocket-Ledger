import type { PositionAction, PositionKind, PositionWithStatus } from "@/types/position"
import type { TransactionDirection } from "@/types/transactions"
import { formatINR } from "@/utils/dateCurrencyUtils"

const kindLabels: Record<PositionKind, string> = {
  sip: "SIP",
  fd: "FD",
  savings: "Savings",
  emergency: "Emergency fund",
}

export function positionKindLabel(kind: PositionKind) {
  return kindLabels[kind]
}

export function positionDirection(action: PositionAction): TransactionDirection {
  return action === "contribute" ? "outflow" : "inflow"
}

export function positionActionOf(direction: string | null | undefined): PositionAction {
  return direction === "inflow" ? "withdraw" : "contribute"
}

export function positionActionLabel(action: PositionAction) {
  return action === "contribute" ? "Contributed" : "Withdrew"
}

export function positionLineTitle(action: PositionAction, name: string | null) {
  if (!name) return action === "contribute" ? "Contribution" : "Withdrawal"
  return action === "contribute" ? `Contributed to ${name}` : `Withdrew from ${name}`
}

export function monthLine(position: PositionWithStatus) {
  if (position.monthlyAmount == null) return null
  return `${formatINR(position.thisMonth)} of ${formatINR(position.monthlyAmount)} this month`
}

export function describePositions(positions: PositionWithStatus[]) {
  if (!positions.length) return "Money you still own after it leaves spending."

  const planned = positions.filter((position) => position.monthlyAmount != null)
  if (!planned.length) {
    const balance = positions.reduce((sum, position) => sum + position.balance, 0)
    return `${formatINR(balance)} contributed across ${positions.length === 1 ? "1 position" : `${positions.length} positions`}.`
  }

  const amount = planned.reduce((sum, position) => sum + (position.monthlyAmount ?? 0), 0)
  const moved = planned.reduce((sum, position) => sum + position.thisMonth, 0)
  return `${formatINR(moved)} of ${formatINR(amount)} this month.`
}

export function describeMonth(positions: PositionWithStatus[]) {
  const planned = positions.filter((position) => position.monthlyAmount != null)
  if (!planned.length) return ""
  const amount = planned.reduce((sum, position) => sum + (position.monthlyAmount ?? 0), 0)
  const moved = planned.reduce((sum, position) => sum + position.thisMonth, 0)
  return `${formatINR(moved)} of ${formatINR(amount)} this month`
}
