import { Plus } from "lucide-react"

import PageHeading from "@/components/PageHeading"
import SegmentedFilter from "@/components/SegmentedFilter"
import { Button } from "@/components/ui/button"
import type { BudgetWithUsage } from "@/types/budget"
import { describeBudgets } from "./budgetCopy"

interface BudgetHeaderProps {
  budgets: BudgetWithUsage[]
  onAdd: () => void
}

function BudgetHeader({ budgets, onAdd }: BudgetHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeading
        title="Budget"
        description={describeBudgets(budgets)}
        action={
          <Button type="button" onClick={onAdd}>
            <Plus data-icon="inline-start" />
            Add budget
          </Button>
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-8">
        <SegmentedFilter
          paramKey="when"
          defaultValue="active"
          options={[
            { label: "Active", value: "active" },
            { label: "Upcoming", value: "upcoming" },
            { label: "Past", value: "past" },
            { label: "All", value: "all" },
          ]}
        />
        <SegmentedFilter
          paramKey="type"
          defaultValue="all"
          options={[
            { label: "All", value: "all" },
            { label: "Expense", value: "expense" },
            { label: "Income", value: "income" },
          ]}
        />
      </div>
    </div>
  )
}

export default BudgetHeader
