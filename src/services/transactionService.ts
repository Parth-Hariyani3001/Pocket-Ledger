import type { PostgrestError } from "@supabase/supabase-js"

import type {
  TransactionFilter,
  TransactionWithRef,
  TransactionWrite,
} from "../types/transactions"
import { PAGE_SIZE } from "../utils/constants"
import { toCamelCase } from "../utils/toCamelCase"
import supabase from "./supabase"

const filters = new Set<TransactionFilter>(["all", "spent", "received", "debt"])

export function asTransactionFilter(value: string | null): TransactionFilter {
  if (value && filters.has(value as TransactionFilter)) return value as TransactionFilter
  return "all"
}

function transactionError(error: PostgrestError) {
  if (error.message.includes("transaction_amount_positive")) {
    return new Error("Enter an amount greater than zero.")
  }

  if (error.message.includes("Income categories")) {
    return new Error("That category is for money you receive.")
  }

  if (error.message.includes("Expense categories")) {
    return new Error("That category is for money you spend.")
  }

  if (error.code === "23503") {
    return new Error("That category or person is no longer available.")
  }

  return new Error(error.message)
}

export async function getTransactions(filter: TransactionFilter, search: string, page: number) {
  let query = supabase.from("transactions_with_ref").select(
    `
      transaction_id,
      debt_id,
      debt_type,
      category_id,
      parent_category_id,
      amount,
      direction,
      transaction_date,
      transaction_type,
      description,
      category_name,
      category_type,
      counterparty
    `,
    { count: "exact" },
  )

  if (filter === "spent") {
    query = query.eq("transaction_type", "category").eq("direction", "outflow")
  } else if (filter === "received") {
    query = query.eq("transaction_type", "category").eq("direction", "inflow")
  } else if (filter === "debt") {
    query = query.eq("transaction_type", "debt")
  }

  const term = search.trim().replace(/[%_]/g, "")
  if (term) query = query.ilike("search_text", `%${term}%`)

  const from = (Math.max(page, 1) - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await query
    .order("transaction_date", { ascending: false })
    .order("transaction_id", { ascending: false })
    .range(from, to)

  if (error) throw new Error("Could not load transactions.")

  return {
    transactions: toCamelCase<TransactionWithRef[]>(data) ?? [],
    count: count ?? 0,
  }
}

export async function createTransaction(transaction: TransactionWrite) {
  const { error } = await supabase.from("transaction").insert([transaction])

  if (error) throw transactionError(error)
}

export async function updateTransaction(transactionId: number, transaction: TransactionWrite) {
  const { error } = await supabase
    .from("transaction")
    .update(transaction)
    .eq("id", transactionId)

  if (error) throw transactionError(error)
}

export async function deleteTransaction(transactionId: number) {
  const { error } = await supabase.from("transaction").delete().eq("id", transactionId)

  if (error) throw transactionError(error)
}
