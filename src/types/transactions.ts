import type { Database } from './supabase'
import type { Camelize } from './camelize'

type TransactionRow =
    Database['public']['Tables']['transaction']['Row']

type TransactionWithRefRow =
    Database['public']['Views']['transactions_with_ref']['Row']

export type TransactionDirection =
    Database['public']['Enums']['transaction_direction']

export type TransactionWithRef = Camelize<TransactionWithRefRow>
export type Transaction = Camelize<TransactionRow>

export type TransactionFilter = "all" | "spent" | "received" | "debt" | "position"

export type TransactionWrite = {
  amount: number
  direction: TransactionDirection
  transaction_date: string
  description: string | null
  category_id: number | null
  debt_id: number | null
  position_id: number | null
}