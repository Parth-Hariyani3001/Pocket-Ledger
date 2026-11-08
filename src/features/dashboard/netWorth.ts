import type { DebtType } from "@/types/debt"
import type { TransactionDirection } from "@/types/transactions"

export type MonthDelta = {
  month: string
  cashDelta: number
  positionDelta: number
  lentDelta: number
  borrowedDelta: number
}

export type MonthClosing = {
  month: string
  cash: number
  positions: number
  lent: number
  borrowed: number
  netWorth: number
}

export type CashLine = {
  amount: number
  direction: TransactionDirection
  positionId: number | null
  debtId: number | null
}

export type DebtOpening = {
  id: number
  debtType: DebtType
  principal: number
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

function add(left: number, right: number) {
  return roundMoney(left + right)
}

export function monthDelta(
  month: string,
  lines: CashLine[],
  openings: DebtOpening[],
  debtTypes: ReadonlyMap<number, DebtType>,
): MonthDelta & { active: boolean } {
  let cashDelta = 0
  let positionDelta = 0
  let lentDelta = 0
  let borrowedDelta = 0

  for (const line of lines) {
    const signed = line.direction === "inflow" ? line.amount : -line.amount
    cashDelta = add(cashDelta, signed)

    if (line.positionId != null) {
      positionDelta = add(positionDelta, line.direction === "outflow" ? line.amount : -line.amount)
    }

    if (line.debtId == null) continue
    const debtType = debtTypes.get(line.debtId)
    if (debtType === "borrowed") {
      borrowedDelta = add(borrowedDelta, line.direction === "inflow" ? line.amount : -line.amount)
    } else if (debtType === "lent") {
      lentDelta = add(lentDelta, line.direction === "outflow" ? line.amount : -line.amount)
    }
  }

  for (const opening of openings) {
    if (opening.debtType === "borrowed") borrowedDelta = add(borrowedDelta, opening.principal)
    else lentDelta = add(lentDelta, opening.principal)
  }

  return {
    month,
    cashDelta,
    positionDelta,
    lentDelta,
    borrowedDelta,
    active: lines.length > 0 || openings.length > 0,
  }
}

export function closingSeries(
  past: MonthDelta[],
  currentMonth: string,
  live: MonthDelta & { active: boolean },
): MonthClosing[] {
  const ordered = past
    .filter((delta) => delta.month < currentMonth)
    .sort((a, b) => a.month.localeCompare(b.month))

  if (!ordered.length && !live.active) return []

  const closings: MonthClosing[] = []
  let cash = 0
  let positions = 0
  let lent = 0
  let borrowed = 0

  for (const delta of ordered) {
    cash = add(cash, delta.cashDelta)
    positions = add(positions, delta.positionDelta)
    lent = add(lent, delta.lentDelta)
    borrowed = add(borrowed, delta.borrowedDelta)
    closings.push({
      month: delta.month,
      cash,
      positions,
      lent,
      borrowed,
      netWorth: roundMoney(cash + positions + lent - borrowed),
    })
  }

  cash = add(cash, live.cashDelta)
  positions = add(positions, live.positionDelta)
  lent = add(lent, live.lentDelta)
  borrowed = add(borrowed, live.borrowedDelta)
  closings.push({
    month: currentMonth,
    cash,
    positions,
    lent,
    borrowed,
    netWorth: roundMoney(cash + positions + lent - borrowed),
  })

  return closings
}

export function holdingFor(closings: MonthClosing[], month: string) {
  let found: MonthClosing | null = null
  for (const closing of closings) {
    if (closing.month <= month) found = closing
    else break
  }
  return found
}
