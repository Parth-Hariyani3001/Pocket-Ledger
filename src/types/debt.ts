import type { Camelize } from "./camelize"
import type { Database } from "./supabase"

type DebtRow = Database["public"]["Tables"]["debt"]["Row"]

export type Debt = Camelize<DebtRow>

export type DebtType = Database["public"]["Enums"]["debt_type"]

export type DebtAction = "increase" | "decrease"

export type DebtCreate = Database["public"]["Tables"]["debt"]["Insert"]

export type DebtUpdate = Database["public"]["Tables"]["debt"]["Update"]

export type DebtWithBalance = {
  id: number
  counterparty: string
  debtType: DebtType
  principal: number
  startDate: string
  dueDate: string | null
  notes: string | null
  remaining: number
}
