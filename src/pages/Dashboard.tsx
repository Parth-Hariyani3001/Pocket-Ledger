import { addMonths, format, isSameMonth, startOfMonth, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import PageHeading from "@/components/PageHeading"
import BookLinesSkeleton from "@/components/BookLinesSkeleton"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { expenseBudgetBalance } from "@/features/budget/budgetCopy"
import { useBudgets } from "@/features/budget/useBudgets"
import CategorySpendChart from "@/features/dashboard/CategorySpendChart"
import MonthFlowChart from "@/features/dashboard/MonthFlowChart"
import { useMonthActivity } from "@/features/dashboard/useMonthActivity"
import { describePositions, monthLine, positionKindLabel } from "@/features/positions/positionCopy"
import { usePositions } from "@/features/positions/usePositions"
import { lineTitle, signedAmount } from "@/features/transactions/transactionCopy"
import useTransactions from "@/features/transactions/useTransactions"
import { cn } from "@/lib/utils"
import { formatINR } from "@/utils/dateCurrencyUtils"

function Dashboard() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const { summary, label, isLoading } = useMonthActivity(month)
  const { transactions, isLoading: transactionsLoading } = useTransactions()
  const { budgets, isLoading: budgetsLoading } = useBudgets()
  const { positions, isLoading: positionsLoading } = usePositions()

  const latest = transactions.slice(0, 6)
  const viewingNow = isSameMonth(month, new Date())
  const today = format(new Date(), "yyyy-MM-dd")
  const activeExpenses = budgets.filter(
    (budget) =>
      budget.category.categoryType === "expense" &&
      budget.startDate <= today &&
      budget.endDate >= today,
  )
  const budget = viewingNow ? expenseBudgetBalance(activeExpenses) : null

  const figures = [
    {
      value: formatINR(summary.spent),
      detail: `Spent in ${label}`,
    },
    {
      value: formatINR(summary.received),
      detail: `Received in ${label}`,
    },
    {
      value: formatINR(summary.left),
      detail: summary.left < 0 ? "Spent more than you received" : "Received minus spent",
      tone: summary.left < 0 ? "out" : undefined,
    },
    ...(budget
      ? [
          {
            value: formatINR(budget.left),
            detail:
              budget.left < 0
                ? `Over a ${formatINR(budget.amount)} limit`
                : `Left of a ${formatINR(budget.amount)} limit`,
            tone: budget.left < 0 ? "out" : undefined,
          },
        ]
      : []),
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Dashboard"
        description="What arrived, what was spent, and what you still hold."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous month"
              onClick={() => setMonth((current) => startOfMonth(subMonths(current, 1)))}
            >
              <ChevronLeft data-icon="inline-start" />
            </Button>
            <span className="min-w-32 text-center font-heading text-lg">{label}</span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next month"
              disabled={viewingNow}
              onClick={() => setMonth((current) => startOfMonth(addMonths(current, 1)))}
            >
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        }
      />

      {isLoading || budgetsLoading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-x-8 gap-y-6 sm:grid-cols-2",
            figures.length > 3 ? "xl:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {figures.map((figure) => (
            <div key={figure.detail} className="flex flex-col gap-1">
              <p
                className={cn(
                  "font-heading text-[2.15rem] leading-none tracking-[-0.02em] tabular-nums",
                  figure.tone === "out" && "text-outflow",
                )}
              >
                {figure.value}
              </p>
              <p className="max-w-[24ch] text-muted-foreground">{figure.detail}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
          <MonthFlowChart days={summary.days} monthLabel={label} />
          <CategorySpendChart categories={summary.categories} />
        </div>
      )}

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
                      <span className="block truncate">{lineTitle(transaction)}</span>
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
                <EmptyDescription>The first line you add will show up here.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link to="/transactions">Go to transactions</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </section>

        <section aria-labelledby="positions-title">
          <h2 id="positions-title" className="text-[1.7rem] font-medium">
            Positions
          </h2>
          {positionsLoading ? (
            <div className="mt-4">
              <BookLinesSkeleton />
            </div>
          ) : positions.length ? (
            <>
              <p className="mt-2 max-w-[36ch] text-muted-foreground">
                {describePositions(positions)}
              </p>
              <ul className="book-lines mt-4">
                {positions.map((position) => {
                  const progress = monthLine(position)
                  return (
                    <li key={position.id} className="flex items-start justify-between gap-4 py-3">
                      <span className="min-w-0">
                        <span className="block truncate">{position.name}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {positionKindLabel(position.kind)}
                        </span>
                        {progress ? (
                          <span className="mt-1 block text-sm text-muted-foreground">{progress}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="book-amount">{formatINR(position.balance)}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">contributed</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <Empty className="mt-4">
              <EmptyHeader>
                <EmptyTitle>No positions yet</EmptyTitle>
                <EmptyDescription>
                  Add savings, a SIP, or an emergency fund and the balance will show here.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild variant="outline">
                  <Link to="/positions">Go to positions</Link>
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
