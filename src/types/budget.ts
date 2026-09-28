import type { Camelize } from "./camelize"
import type { CategoryType } from "./categories"
import type { Database } from "./supabase"

type BudgetRow = Database["public"]["Tables"]["budget"]["Row"]

export type Budget = Camelize<BudgetRow>

export type BudgetCreate = Database["public"]["Tables"]["budget"]["Insert"]

export type BudgetUpdate = Database["public"]["Tables"]["budget"]["Update"]

export type BudgetCategory = {
  id: number
  categoryName: string
  categoryType: CategoryType
  color: string
  parentCategory: number | null
}

export type BudgetCategoryOption = BudgetCategory & {
  parentName: string | null
}

export type BudgetWithUsage = {
  id: number
  amount: number
  categoryId: number
  startDate: string
  endDate: string
  createdAt: string
  category: BudgetCategory
  parentName: string | null
  spent: number
}

export type BudgetList = {
  budgets: BudgetWithUsage[]
  categories: BudgetCategoryOption[]
}
