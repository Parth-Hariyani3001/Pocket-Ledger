import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { formatINR } from "@/utils/dateCurrencyUtils"
import type { CategorySpend } from "./summarizeMonth"
import { usePrefersReducedMotion } from "./usePrefersReducedMotion"

const chartConfig = {
  amount: {
    label: "Spent",
    color: "var(--outflow)",
  },
} satisfies ChartConfig

function CategorySpendChart({ categories }: { categories: CategorySpend[] }) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where it went</CardTitle>
        <CardDescription>Spending rolled up to each parent category.</CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: Math.max(categories.length * 40, 160) }}
          >
            <BarChart
              accessibilityLayer
              data={categories}
              layout="vertical"
              margin={{ left: 0, right: 8 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={104}
                tickFormatter={(value: string) =>
                  value.length > 14 ? `${value.slice(0, 13)}…` : value
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _name, item) => (
                      <span className="flex flex-1 items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {String(item.payload?.name ?? "Spent")}
                        </span>
                        <span className="tabular-nums">{formatINR(Number(value))}</span>
                      </span>
                    )}
                  />
                }
              />
              <Bar dataKey="amount" radius={4} isAnimationActive={!reduceMotion}>
                {categories.map((category) => (
                  <Cell key={category.name} fill={category.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
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
