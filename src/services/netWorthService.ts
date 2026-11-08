import { endOfMonth, format, startOfMonth } from "date-fns"

import type { DebtType } from "@/types/debt"
import type { TransactionDirection } from "@/types/transactions"
import { closingSeries, monthDelta, type MonthDelta } from "@/features/dashboard/netWorth"
import supabase from "./supabase"

function asMoney(value: number | string | null) {
  return Number(value ?? 0)
}

export async function getNetWorthSeries(today = new Date()) {
  const { error: refreshError } = await supabase.rpc("refresh_month_balances")
  if (refreshError) throw new Error("Could not refresh closed months.")

  const currentMonth = format(startOfMonth(today), "yyyy-MM-dd")
  const currentEnd = format(endOfMonth(today), "yyyy-MM-dd")

  const [storedResult, lineResult, openingResult] = await Promise.all([
    supabase
      .from("month_balance")
      .select("month, cash_delta, position_delta, lent_delta, borrowed_delta")
      .lt("month", currentMonth)
      .order("month", { ascending: true }),
    supabase
      .from("transaction")
      .select("amount, direction, position_id, debt_id")
      .gte("transaction_date", currentMonth)
      .lte("transaction_date", currentEnd),
    supabase
      .from("debt")
      .select("id, debt_type, principal")
      .gte("start_date", currentMonth)
      .lte("start_date", currentEnd),
  ])

  if (storedResult.error || lineResult.error || openingResult.error) {
    throw new Error("Could not load what you hold.")
  }

  const openings = (openingResult.data ?? []).map((row) => ({
    id: row.id,
    debtType: row.debt_type,
    principal: asMoney(row.principal),
  }))
  const debtTypes = new Map<number, DebtType>(openings.map((opening) => [opening.id, opening.debtType]))
  const lines = lineResult.data ?? []
  const missingDebtIds = [
    ...new Set(
      lines
        .map((line) => line.debt_id)
        .filter((id): id is number => id != null && !debtTypes.has(id)),
    ),
  ]

  if (missingDebtIds.length) {
    const { data, error } = await supabase
      .from("debt")
      .select("id, debt_type")
      .in("id", missingDebtIds)

    if (error) throw new Error("Could not load what you hold.")
    for (const row of data ?? []) debtTypes.set(row.id, row.debt_type)
  }

  const past: MonthDelta[] = (storedResult.data ?? []).map((row) => ({
    month: row.month,
    cashDelta: asMoney(row.cash_delta),
    positionDelta: asMoney(row.position_delta),
    lentDelta: asMoney(row.lent_delta),
    borrowedDelta: asMoney(row.borrowed_delta),
  }))

  const live = monthDelta(
    currentMonth,
    lines.map((line) => ({
      amount: asMoney(line.amount),
      direction: line.direction as TransactionDirection,
      positionId: line.position_id,
      debtId: line.debt_id,
    })),
    openings,
    debtTypes,
  )

  return closingSeries(past, currentMonth, live)
}
