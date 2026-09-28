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
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/features/categories/useCategories"
import useTransactions from "@/features/transactions/useTransactions"
import { formatINR } from "@/utils/dateCurrencyUtils"

function signedAmount(amount: number, direction: string | null) {
  const formatted = formatINR(Math.abs(amount))
  if (direction === "outflow") return `−${formatted}`
  if (direction === "inflow") return `+${formatted}`
  return formatted
}

function Dashboard() {
  const { transactions, isLoading: transactionsLoading } = useTransactions()
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const latest = transactions.slice(0, 6)
  const categoryNames = (categories ?? []).filter((category) => !category.parentCategory)

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Dashboard"
        description="The latest lines in the book, and the categories they belong to."
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
        <section aria-labelledby="latest-title">
          {transactionsLoading ? (
            <div className="flex flex-col gap-3" aria-busy="true">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : latest.length ? (
            <figure className="site-sheet" aria-labelledby="latest-title">
              <figcaption id="latest-title">Latest lines</figcaption>
              <ul>
                {latest.map((transaction) => (
                  <li key={transaction.transactionId}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">
                        {transaction.categoryName ||
                          transaction.counterparty ||
                          transaction.description ||
                          "Transaction"}
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
            <div className="mt-4 flex flex-col gap-3" aria-busy="true">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
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
