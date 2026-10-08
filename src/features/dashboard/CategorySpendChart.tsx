import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { formatINR } from "@/utils/dateCurrencyUtils"
import type { CategorySpend } from "./summarizeMonth"

type SpendGroup = {
  key: string
  title: string | null
  items: CategorySpend[]
  total: number
}

function shareLabel(share: number) {
  const percent = share * 100
  if (percent > 0 && percent < 1) return "<1%"
  return `${Math.round(percent)}%`
}

function spendCaption(categories: CategorySpend[]) {
  const parentNames = [
    ...new Set(categories.map((category) => category.parentName).filter(Boolean)),
  ]
  const hasRoot = categories.some((category) => category.parentName == null)
  if (parentNames.length === 1 && !hasRoot) return `Inside ${parentNames[0]}.`
  return "Each category the money was filed under."
}

function spendGroups(categories: CategorySpend[]): SpendGroup[] {
  const groups = new Map<string, SpendGroup>()

  for (const category of categories) {
    const key =
      category.parentId != null ? `parent:${category.parentId}` : `category:${category.id}`
    const group = groups.get(key) ?? {
      key,
      title: category.parentName,
      items: [],
      total: 0,
    }
    group.items.push(category)
    group.total += category.amount
    groups.set(key, group)
  }

  return [...groups.values()].sort((a, b) => b.total - a.total || (a.title ?? "").localeCompare(b.title ?? ""))
}

function CategoryRow({ category }: { category: CategorySpend }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1.5">
      <span className="truncate">{category.name}</span>
      <span className="tabular-nums">{formatINR(category.amount)}</span>
      <div className="col-span-2 flex items-center gap-2">
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full rounded-full"
            style={{
              width: `${category.share * 100}%`,
              minWidth: category.share > 0 ? "3px" : 0,
              backgroundColor: category.color,
            }}
          />
        </div>
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
          {shareLabel(category.share)}
        </span>
      </div>
    </li>
  )
}

function CategorySpendChart({ categories }: { categories: CategorySpend[] }) {
  const groups = spendGroups(categories)
  const showHeadings = groups.length > 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where it went</CardTitle>
        <CardDescription>
          {categories.length ? spendCaption(categories) : "Spending in this month, by category."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length ? (
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.key} className="flex flex-col gap-3">
                {showHeadings && group.title ? (
                  <p className="text-sm text-muted-foreground">{group.title}</p>
                ) : null}
                <ul className="flex flex-col gap-3">
                  {group.items.map((category) => (
                    <CategoryRow key={category.id} category={category} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <Empty className="min-h-40">
            <EmptyHeader>
              <EmptyTitle>Nothing spent</EmptyTitle>
              <EmptyDescription>
                Spending in this month will show up by category.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline">
                <Link to="/transactions">Go to transactions</Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

export default CategorySpendChart
