import { format } from "date-fns"
import { Link } from "react-router-dom"

import PageHeading from "@/components/PageHeading"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import BookLinesSkeleton from "@/components/BookLinesSkeleton"
import { describeExpenseBudgets, describeIncomeBudgets } from "@/features/budget/budgetCopy"
import { useBudgets } from "@/features/budget/useBudgets"
import { useCategories } from "@/features/categories/useCategories"
import { describeMonth } from "@/features/positions/positionCopy"
import { usePositions } from "@/features/positions/usePositions"
import { lineTitle, signedAmount } from "@/features/transactions/transactionCopy"
import useTransactions from "@/features/transactions/useTransactions"
import { formatINR } from "@/utils/dateCurrencyUtils"

function planLine(sentence: string | null, empty: string) {
  return sentence ?? empty
}

function Dashboard() {
  const { transactions, isLoading: transactionsLoading } = useTransactions()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { budgets, isLoading: budgetsLoading } = useBudgets()
  const { positions, isLoading: positionsLoading } = usePositions()

  const latest = transactions.slice(0, 6)
  const categoryNames = (categories ?? []).filter((category) => !category.parentCategory)
  const today = format(new Date(), "yyyy-MM-dd")
  const activeBudgets = budgets.filter(
    (budget) => budget.startDate <= today && budget.endDate >= today,
  )
  const summaryLoading = budgetsLoading || positionsLoading
  const incomeLine = describeIncomeBudgets(activeBudgets)
  const expenseLine = describeExpenseBudgets(activeBudgets)
  const fundingLine = describeMonth(positions)

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Dashboard"
        description="What arrived, what was spent, and what you still hold."
      />

      <section aria-labelledby="plan-title">
        <h2 id="plan-title" className="text-[1.7rem] font-medium">
          This month
        </h2>
        {summaryLoading ? (
          <div className="mt-4">
            <BookLinesSkeleton />
          </div>
        ) : (
          <ul className="book-lines mt-4">
            <li className="flex items-center justify-between gap-4 py-3">
              <span>Income</span>
              <span className="text-right tabular-nums">{planLine(incomeLine, "No income budget")}</span>
            </li>
            <li className="flex items-center justify-between gap-4 py-3">
              <span>Spending</span>
              <span className="text-right tabular-nums">{planLine(expenseLine, "No expense budget")}</span>
            </li>
            <li className="flex items-center justify-between gap-4 py-3">
              <span>Positions</span>
              <span className="text-right tabular-nums">{planLine(fundingLine || null, "No monthly amount")}</span>
            </li>
          </ul>
        )}
        {!positionsLoading && positions.length ? (
          <ul className="book-lines mt-2">
            {positions.map((position) => (
              <li key={position.id} className="flex items-start justify-between gap-4 py-3">
                <span className="truncate">{position.name}</span>
                <span className="shrink-0 text-right">
                  <span className="book-amount">{formatINR(position.balance)}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">contributed</span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
        <section aria-labelledby="latest-title">
          {transactionsLoading ? (
            <BookLinesSkeleton />
          ) : latest.length ? (
            <figure className="site-sheet" aria-labelledby="latest-title">
              <figcaption id="latest-title">Latest lines</figcaption>
              <ul>
                {latest.map((transaction) => (
                  <li key={transaction.transactionId}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">
                        {lineTitle(transaction)}
                      </span>
                      {transaction.description ? (
                        <span className="block truncate text-sm text-[#d5e2ea]">
                          {transaction.description}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={transaction.direction === "inflow" ? "in" : "out"}
                      data-amount
                    >
                      {signedAmount(Number(transaction.amount), transaction.direction)}
                    </span>
                  </li>
                ))}
              </ul>
            </figure>
          ) : (
            <Empty aria-labelledby="latest-title">
              <EmptyHeader>
                <EmptyTitle id="latest-title">No transactions yet</EmptyTitle>
                <EmptyDescription>
                  The first line you add will show up here.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link to="/transactions">Go to transactions</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </section>

        <section aria-labelledby="categories-title">
          <h2 id="categories-title" className="text-[1.7rem] font-medium">
            Categories
          </h2>
          {categoriesLoading ? (
            <div className="mt-4">
              <BookLinesSkeleton />
            </div>
          ) : categoryNames.length ? (
            <ul className="book-lines mt-4">
              {categoryNames.map((category) => (
                <li key={category.id}>
                  <div className="flex items-center gap-3 py-3">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate">{category.categoryName}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty className="mt-4 items-start border-0 p-0 text-left">
              <EmptyHeader className="items-start text-left">
                <EmptyTitle>No categories yet</EmptyTitle>
                <EmptyDescription>
                  Name the groups you want transactions to fall into.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="items-start">
                <Button asChild variant="outline">
                  <Link to="/categories">Go to categories</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
