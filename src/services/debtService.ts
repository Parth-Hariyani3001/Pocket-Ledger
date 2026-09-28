import type { PostgrestError } from "@supabase/supabase-js"

import type { DebtCreate, DebtType, DebtUpdate, DebtWithBalance } from "../types/debt"
import type { TransactionDirection } from "../types/transactions"
import supabase from "./supabase"

type DebtRow = {
  id: number
  counterparty: string
  debt_type: DebtType
  principal: number | string
  start_date: string
  due_date: string | null
  notes: string | null
}

type MovementRow = {
  debt_id: number | null
  amount: number | string
  direction: TransactionDirection
}

function asMoney(value: number | string) {
  return Number(value)
}

function movement(debtType: DebtType, direction: TransactionDirection, amount: number) {
  const increases =
    (debtType === "borrowed" && direction === "inflow") ||
    (debtType === "lent" && direction === "outflow")

  return increases ? amount : -amount
}

function debtError(error: PostgrestError) {
  if (error.code === "23503") {
    return new Error("This person still has transactions. Remove those lines first.")
  }

  if (error.message.includes("debt_principal_positive")) {
    return new Error("Enter an amount greater than zero.")
  }

  if (error.message.includes("debt_due_after_start")) {
    return new Error("The due date has to be on or after the start date.")
  }

  if (error.message.includes("debt_counterparty_not_blank")) {
    return new Error("Enter a name.")
  }

  return new Error(error.message)
}

export async function getDebts(): Promise<DebtWithBalance[]> {
  const [debtResult, movementResult] = await Promise.all([
    supabase.from("debt").select(
      "id, counterparty, debt_type, principal, start_date, due_date, notes",
    ),
    supabase
      .from("transaction")
      .select("debt_id, amount, direction")
      .not("debt_id", "is", null),
  ])

  if (debtResult.error) throw new Error(debtResult.error.message)
  if (movementResult.error) throw new Error(movementResult.error.message)

  const movements = (movementResult.data ?? []) as MovementRow[]

  return ((debtResult.data ?? []) as DebtRow[])
    .map((row) => {
      const adjusted = movements.reduce((sum, item) => {
        if (item.debt_id !== row.id) return sum
        return sum + movement(row.debt_type, item.direction, asMoney(item.amount))
      }, 0)

      return {
        id: row.id,
        counterparty: row.counterparty,
        debtType: row.debt_type,
        principal: asMoney(row.principal),
        startDate: row.start_date,
        dueDate: row.due_date,
        notes: row.notes,
        remaining: asMoney(row.principal) + adjusted,
      }
    })
    .sort((a, b) => a.counterparty.localeCompare(b.counterparty))
}

export async function createDebt(debt: DebtCreate) {
  const { error } = await supabase.from("debt").insert([debt])

  if (error) throw debtError(error)
}

interface UpdateDebtArgs {
  debtId: number
  debt: DebtUpdate
}

export async function updateDebt({ debtId, debt }: UpdateDebtArgs) {
  const { error } = await supabase.from("debt").update(debt).eq("id", debtId)

  if (error) throw debtError(error)
}

export async function deleteDebt(id: number) {
  const { error } = await supabase.from("debt").delete().eq("id", id)

  if (error) throw debtError(error)
}
