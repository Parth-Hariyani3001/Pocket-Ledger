import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns"

import type { Category } from "@/types/categories"
import type { MonthActivityLine } from "@/types/transactions"

const FALLBACK_COLORS = [
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
]

export type DayPoint = {
  date: string
  label: string
  day: string
  spent: number
  received: number
}

export type CategorySpend = {
  id: number
  name: string
  parentId: number | null
  parentName: string | null
  amount: number
  share: number
  color: string
}

export type MonthSummary = {
  spent: number
  received: number
  left: number
  days: DayPoint[]
  categories: CategorySpend[]
  hasActivity: boolean
}

export function summarizeMonth(
  rows: MonthActivityLine[],
  categories: Category[],
  month: Date,
): MonthSummary {
  const byId = new Map(categories.map((category) => [category.id, category]))
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  }).map((date) => ({
    date: format(date, "yyyy-MM-dd"),
    label: format(date, "d MMM"),
    day: format(date, "d"),
    spent: 0,
    received: 0,
  }))
  const byDate = new Map(days.map((day) => [day.date, day]))
  const byCategory = new Map<
    number,
    Omit<CategorySpend, "share" | "color"> & { color: string | null }
  >()

  let spent = 0
  let received = 0

  for (const row of rows) {
    const amount = Number(row.amount ?? 0)
    if (!amount || !row.transactionDate) continue
    const day = byDate.get(row.transactionDate)

    if (row.direction === "inflow") {
      received += amount
      if (day) day.received += amount
      continue
    }

    if (row.direction !== "outflow") continue

    spent += amount
    if (day) day.spent += amount

    const filed = row.categoryId != null ? byId.get(row.categoryId) : undefined
    const parentId = filed?.parentCategory ?? null
    const parent = parentId != null ? byId.get(parentId) : undefined
    const id = row.categoryId ?? 0
    const current = byCategory.get(id) ?? {
      id,
      name: filed?.categoryName ?? row.categoryName ?? "Uncategorized",
      parentId,
      parentName: parent?.categoryName ?? null,
      amount: 0,
      color: filed?.color ?? null,
    }
    current.amount += amount
    byCategory.set(id, current)
  }

  const categorySpend = [...byCategory.values()]
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
    .map((item, index) => ({
      ...item,
      color: item.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
      share: spent > 0 ? item.amount / spent : 0,
    }))

  return {
    spent,
    received,
    left: received - spent,
    days,
    categories: categorySpend,
    hasActivity: spent > 0 || received > 0,
  }
}
