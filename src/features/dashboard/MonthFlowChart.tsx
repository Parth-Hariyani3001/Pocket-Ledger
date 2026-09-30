import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { formatINR } from "@/utils/dateCurrencyUtils"
import type { DayPoint } from "./summarizeMonth"
import { usePrefersReducedMotion } from "./usePrefersReducedMotion"

const chartConfig = {
  received: {
    label: "Received",
    color: "var(--inflow)",
  },
  spent: {
    label: "Spent",
    color: "var(--outflow)",
  },
} satisfies ChartConfig

function MonthFlowChart({ days, monthLabel }: { days: DayPoint[]; monthLabel: string }) {
  const reduceMotion = usePrefersReducedMotion()
  const hasActivity = days.some((day) => day.spent > 0 || day.received > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Through the month</CardTitle>
        <CardDescription>Money in and money out, {monthLabel}.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasActivity ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <AreaChart accessibilityLayer data={days} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                tickFormatter={(value: string) => value.split(" ")[0] ?? value}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span className="flex flex-1 items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                        </span>
                        <span className="tabular-nums">{formatINR(Number(value))}</span>
                      </span>
                    )}
                  />
                }
              />
              <Area
                dataKey="received"
                type="monotone"
                fill="var(--color-received)"
                stroke="var(--color-received)"
                fillOpacity={0.18}
                strokeWidth={2}
                isAnimationActive={!reduceMotion}
              />
              <Area
                dataKey="spent"
                type="monotone"
                fill="var(--color-spent)"
                stroke="var(--color-spent)"
                fillOpacity={0.18}
                strokeWidth={2}
                isAnimationActive={!reduceMotion}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <Empty className="min-h-64">
            <EmptyHeader>
              <EmptyTitle>No movement this month</EmptyTitle>
              <EmptyDescription>
                Add a transaction and the days will fill in here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

export default MonthFlowChart
