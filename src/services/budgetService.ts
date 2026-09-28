import type { PostgrestError } from "@supabase/supabase-js"

import type {
  BudgetCategory,
  BudgetCategoryOption,
  BudgetCreate,
  BudgetList,
  BudgetUpdate,
  BudgetWithUsage,
} from "../types/budget"
import type { CategoryType } from "../types/categories"
import { toCamelCase } from "../utils/toCamelCase"
import supabase from "./supabase"

type CategoryRow = {
  id: number
  category_name: string
  category_type: CategoryType
  color: string
  parent_category: number | null
}

type BudgetRow = {
  id: number
  amount: number | string
  category_id: number
  start_date: string
  end_date: string
  created_at: string
  categories: CategoryRow | CategoryRow[] | null
}

type TransactionRow = {
  amount: number | string
  category_id: number | null
  transaction_date: string
  direction: "inflow" | "outflow"
}

function oneCategory(value: BudgetRow["categories"]): CategoryRow | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function asMoney(value: number | string) {
  return Number(value)
}

function budgetError(error: PostgrestError) {
  if (error.code === "23P01" || error.message.includes("budget_no_overlap")) {
    return new Error("This category already has a budget in these dates.")
  }

  if (error.message.includes("budget_amount_positive")) {
    return new Error("Enter an amount greater than zero.")
  }

  if (error.message.includes("budget_date_range")) {
    return new Error("The end date has to be on or after the start date.")
  }

  if (error.message.includes("parent category")) {
    return new Error("Budgets can only be set on a parent category.")
  }

  return new Error(error.message)
}

function parentNames(categories: CategoryRow[]) {
  const names = new Map(categories.map((category) => [category.id, category.category_name]))
  return names
}

export async function getBudgets(): Promise<BudgetList> {
  const [budgetResult, categoryResult] = await Promise.all([
    supabase
      .from("budget")
      .select(`
        id,
        amount,
        category_id,
        start_date,
        end_date,
        created_at,
        categories (
          id,
          category_name,
          category_type,
          color,
          parent_category
        )
      `)
      .order("start_date", { ascending: false }),
    supabase
      .from("categories")
      .select("id, category_name, category_type, color, parent_category")
      .order("category_name", { ascending: true }),
  ])

  if (budgetResult.error) throw new Error(budgetResult.error.message)
  if (categoryResult.error) throw new Error(categoryResult.error.message)

  const categoryRows = (categoryResult.data ?? []) as CategoryRow[]
  const names = parentNames(categoryRows)
  const children = new Map<number, number[]>()

  for (const category of categoryRows) {
    if (category.parent_category == null) continue
    const list = children.get(category.parent_category) ?? []
    list.push(category.id)
    children.set(category.parent_category, list)
  }

  const budgetRows = (budgetResult.data ?? []) as BudgetRow[]
  const dated = budgetRows.filter((row) => oneCategory(row.categories))

  let transactions: TransactionRow[] = []

  if (dated.length) {
    const start = dated.reduce(
      (earliest, row) => (row.start_date < earliest ? row.start_date : earliest),
      dated[0].start_date,
    )
    const end = dated.reduce(
      (latest, row) => (row.end_date > latest ? row.end_date : latest),
      dated[0].end_date,
    )

    const { data, error } = await supabase
      .from("transaction")
      .select("amount, category_id, transaction_date, direction")
      .not("category_id", "is", null)
      .gte("transaction_date", start)
      .lte("transaction_date", end)

    if (error) throw new Error(error.message)
    transactions = (data ?? []) as TransactionRow[]
  }

  const budgets: BudgetWithUsage[] = dated.flatMap((row) => {
    const category = oneCategory(row.categories)
    if (!category) return []

    const covered = new Set([category.id, ...(children.get(category.id) ?? [])])
    const direction = category.category_type === "income" ? "inflow" : "outflow"
    const spent = transactions.reduce((sum, transaction) => {
      if (transaction.category_id == null || !covered.has(transaction.category_id)) {
        return sum
      }
      if (transaction.direction !== direction) return sum
      if (
        transaction.transaction_date < row.start_date ||
        transaction.transaction_date > row.end_date
      ) {
        return sum
      }
      return sum + asMoney(transaction.amount)
    }, 0)

    const camelCategory = toCamelCase<BudgetCategory>(category)

    return [
      {
        id: row.id,
        amount: asMoney(row.amount),
        categoryId: row.category_id,
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: row.created_at,
        category: camelCategory,
        parentName:
          category.parent_category == null
            ? null
            : (names.get(category.parent_category) ?? null),
        spent,
      },
    ]
  })

  const categories: BudgetCategoryOption[] = categoryRows.map((category) => ({
    ...toCamelCase<BudgetCategory>(category),
    parentName:
      category.parent_category == null
        ? null
        : (names.get(category.parent_category) ?? null),
  }))

  return { budgets, categories }
}

export async function createBudget(budget: BudgetCreate) {
  const { error } = await supabase.from("budget").insert([budget])

  if (error) throw budgetError(error)
}

interface UpdateBudgetArgs {
  budgetId: number
  budget: BudgetUpdate
}

export async function updateBudget({ budgetId, budget }: UpdateBudgetArgs) {
  const { error } = await supabase.from("budget").update(budget).eq("id", budgetId)

  if (error) throw budgetError(error)
}

export async function deleteBudget(id: number) {
  const { error } = await supabase.from("budget").delete().eq("id", id)

  if (error) throw new Error(error.message)
}
