import type { BudgetWithUsage } from "@/types/budget"
import { formatINR } from "@/utils/dateCurrencyUtils"

function rangesOverlap(a: BudgetWithUsage, b: BudgetWithUsage) {
  return a.startDate <= b.endDate && b.startDate <= a.endDate
}

function totals(budgets: BudgetWithUsage[]) {
  const counted = budgets.filter(
    (budget) =>
      !budgets.some(
        (other) =>
          other.id !== budget.id &&
          other.categoryId === budget.category.parentCategory &&
          rangesOverlap(budget, other),
      ),
  )

  return counted.reduce(
    (sum, budget) => ({
      amount: sum.amount + budget.amount,
      spent: sum.spent + budget.spent,
    }),
    { amount: 0, spent: 0 },
  )
}

export function describeBudgets(budgets: BudgetWithUsage[]) {
  if (!budgets.length) {
    return "A limit for each parent category, for the dates you choose."
  }

  const sentences: string[] = []
  const expenses = budgets.filter((budget) => budget.category.categoryType === "expense")
  const income = budgets.filter((budget) => budget.category.categoryType === "income")

  if (expenses.length) {
    const { amount, spent } = totals(expenses)
    const left = amount - spent
    sentences.push(
      left >= 0
        ? `${formatINR(left)} left of ${formatINR(amount)} in expenses`
        : `${formatINR(Math.abs(left))} over ${formatINR(amount)} in expenses`,
    )
  }

  if (income.length) {
    const { amount, spent } = totals(income)
    sentences.push(`${formatINR(spent)} received of ${formatINR(amount)} in income`)
  }

  return `${sentences.join(". ")}.`
}

export function budgetTitle(
  budget:
    | { parentName: string | null; categoryName: string }
    | { parentName: string | null; category: { categoryName: string } },
) {
  const name = "categoryName" in budget ? budget.categoryName : budget.category.categoryName
  return budget.parentName ? `${budget.parentName} / ${name}` : name
}
