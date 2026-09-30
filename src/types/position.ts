import type { Camelize } from "./camelize"
import type { Database } from "./supabase"

type PositionRow = Database["public"]["Tables"]["position"]["Row"]

export type Position = Camelize<PositionRow>

export type PositionKind = Database["public"]["Enums"]["position_kind"]

export type PositionAction = "contribute" | "withdraw"

export type PositionCreate = Database["public"]["Tables"]["position"]["Insert"]

export type PositionUpdate = Database["public"]["Tables"]["position"]["Update"]

export type PositionWithStatus = {
  id: number
  name: string
  kind: PositionKind
  notes: string | null
  monthlyAmount: number | null
  marketValue: number | null
  valuedOn: string | null
  balance: number
  thisMonth: number
}
