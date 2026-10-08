import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { formatINR } from "@/utils/dateCurrencyUtils"
import { cn } from "@/lib/utils"
import type { DayPoint } from "./summarizeMonth"

function peak(days: DayPoint[], key: "received" | "spent") {
  return days.reduce((max, day) => Math.max(max, day[key]), 0)
}

function FlowLane({
  days,
  dataKey,
  label,
  color,
}: {
  days: DayPoint[]
  dataKey: "received" | "spent"
  label: string
  color: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const largest = peak(days, dataKey)
  const hovered = active != null ? days[active] : null

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 text-sm">
          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
          {label}
        </span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {hovered
            ? `${hovered.label} ${formatINR(hovered[dataKey])}`
            : largest > 0
              ? `Largest day ${formatINR(largest)}`
              : "None this month"}
        </span>
      </div>
      <div className="flex h-20 items-end" role="group" aria-label={`${label} by day`}>
        {days.map((day, index) => {
          const value = day[dataKey]
          const share = largest > 0 ? (value / largest) * 100 : 0
          return (
            <button
              key={day.date}
              type="button"
              className={cn(
                "relative h-full min-w-0 flex-1 rounded-sm outline-none focus-visible:bg-muted",
                active === index && "bg-muted/80",
              )}
              aria-label={`${day.label}, ${formatINR(value)}`}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(index)
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setActive(null)
              }}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
            >
              <span
                className="absolute inset-x-px bottom-0 rounded-t-[2px]"
                style={{
                  height: value > 0 ? `max(3px, ${share}%)` : 0,
                  backgroundColor: color,
                }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DayScale({ days }: { days: DayPoint[] }) {
  return (
    <div className="flex" aria-hidden>
      {days.map((day, index) => {
        const show = index === 0 || index === days.length - 1 || index % 5 === 0
        return (
          <span
            key={day.date}
            className="flex-1 text-center text-[11px] text-muted-foreground tabular-nums"
          >
            {show ? day.day : ""}
          </span>
        )
      })}
    </div>
  )
}

function MonthFlowChart({ days, monthLabel }: { days: DayPoint[]; monthLabel: string }) {
  const hasActivity = days.some((day) => day.spent > 0 || day.received > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Through the month</CardTitle>
        <CardDescription>
          Received and spent each use their own scale, {monthLabel}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasActivity ? (
          <div className="flex flex-col gap-4">
            <FlowLane days={days} dataKey="received" label="Received" color="var(--inflow)" />
            <FlowLane days={days} dataKey="spent" label="Spent" color="var(--outflow)" />
            <DayScale days={days} />
          </div>
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
