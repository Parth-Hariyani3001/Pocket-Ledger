import type { PostgrestError } from "@supabase/supabase-js"
import { endOfMonth, format, startOfMonth } from "date-fns"

import type {
  PositionCreate,
  PositionKind,
  PositionUpdate,
  PositionWithStatus,
} from "../types/position"
import type { TransactionDirection } from "../types/transactions"
import supabase from "./supabase"

type PositionRow = {
  id: number
  name: string
  kind: PositionKind
  notes: string | null
  monthly_amount: number | string | null
  market_value: number | string | null
  valued_on: string | null
}

type MovementRow = {
  position_id: number | null
  amount: number | string
  direction: TransactionDirection
  transaction_date: string
}

function asMoney(value: number | string) {
  return Number(value)
}

function positionError(error: PostgrestError) {
  if (error.code === "23503") {
    return new Error("This position still has transactions. Remove those lines first.")
  }

  if (error.message.includes("position_monthly_amount_positive")) {
    return new Error("Enter a monthly amount greater than zero.")
  }

  if (error.message.includes("position_name_not_blank")) {
    return new Error("Enter a name.")
  }

  if (error.message.includes("position_value_has_date")) {
    return new Error("A value needs the date you marked it.")
  }

  if (error.message.includes("position_market_value_nonnegative")) {
    return new Error("Enter a value of zero or more.")
  }

  return new Error(error.message)
}

function net(movements: MovementRow[], positionId: number, start?: string, end?: string) {
  return movements.reduce((sum, item) => {
    if (item.position_id !== positionId) return sum
    if (start && item.transaction_date < start) return sum
    if (end && item.transaction_date > end) return sum
    const amount = asMoney(item.amount)
    return item.direction === "outflow" ? sum + amount : sum - amount
  }, 0)
}

export async function getPositions(): Promise<PositionWithStatus[]> {
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd")
  const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd")

  const [positionResult, movementResult] = await Promise.all([
    supabase
      .from("position")
      .select("id, name, kind, notes, monthly_amount, market_value, valued_on"),
    supabase
      .from("transaction")
      .select("position_id, amount, direction, transaction_date")
      .not("position_id", "is", null),
  ])

  if (positionResult.error) throw new Error(positionResult.error.message)
  if (movementResult.error) throw new Error(movementResult.error.message)

  const movements = (movementResult.data ?? []) as MovementRow[]

  return ((positionResult.data ?? []) as PositionRow[])
    .map((row) => ({
      id: row.id,
      name: row.name,
      kind: row.kind,
      notes: row.notes,
      monthlyAmount: row.monthly_amount == null ? null : asMoney(row.monthly_amount),
      marketValue: row.market_value == null ? null : asMoney(row.market_value),
      valuedOn: row.valued_on,
      balance: net(movements, row.id),
      thisMonth: net(movements, row.id, monthStart, monthEnd),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function createPosition(position: PositionCreate) {
  const { data, error } = await supabase.from("position").insert([position]).select("id").single()

  if (error) throw positionError(error)
  return data.id
}

interface UpdatePositionArgs {
  positionId: number
  position: PositionUpdate
}

export async function updatePosition({ positionId, position }: UpdatePositionArgs) {
  const { error } = await supabase.from("position").update(position).eq("id", positionId)

  if (error) throw positionError(error)
}

export async function deletePosition(id: number) {
  const { error } = await supabase.from("position").delete().eq("id", id)

  if (error) throw positionError(error)
}
