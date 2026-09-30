import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns"

import type { Category } from "@/types/categories"
import type { MonthActivityLine } from "@/types/transactions"

const VISIBLE_CATEGORIES = 6

export type DayPoint = {
  date: string
  label: string
  day: string
  spent: number
  received: number
}

export type CategorySpend = {
  name: string
  amount: number
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
  const byParent = new Map<number, CategorySpend>()

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

    const parentId = row.parentCategoryId ?? row.categoryId
    if (parentId == null) continue
    const parent = byId.get(parentId)
    const current = byParent.get(parentId) ?? {
      name: parent?.categoryName ?? row.categoryName ?? "Uncategorized",
      amount: 0,
      color: parent?.color ?? "var(--chart-3)",
    }
    current.amount += amount
    byParent.set(parentId, current)
  }

  const ranked = [...byParent.values()].sort((a, b) => b.amount - a.amount)
  const head = ranked.slice(0, VISIBLE_CATEGORIES)
  const rest = ranked.slice(VISIBLE_CATEGORIES)
  const categorySpend = rest.length
    ? [
        ...head,
        {
          name: "Other",
          amount: rest.reduce((sum, item) => sum + item.amount, 0),
          color: "var(--chart-5)",
        },
      ]
    : head

  return {
    spent,
    received,
    left: received - spent,
    days,
    categories: categorySpend,
    hasActivity: spent > 0 || received > 0,
  }
}
