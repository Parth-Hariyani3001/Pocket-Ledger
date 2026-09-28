import { format, parseISO } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { BudgetWithUsage } from "@/types/budget"
import { formatINR } from "@/utils/dateCurrencyUtils"
import { budgetTitle } from "./budgetCopy"
import { useDeleteBudget } from "./useDeleteBudget"

interface BudgetItemProps {
  budget: BudgetWithUsage
  onEdit: (budget: BudgetWithUsage) => void
}

function formatDay(value: string) {
  return format(parseISO(value), "d MMM yyyy")
}

function remainderLabel(budget: BudgetWithUsage, remaining: number) {
  if (budget.category.categoryType === "income") {
    return remaining >= 0 ? "still to receive" : "above target"
  }
  return remaining >= 0 ? "left" : "over"
}

function BudgetItem({ budget, onEdit }: BudgetItemProps) {
  const { deleteBudget, isDeleting } = useDeleteBudget()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const title = budgetTitle(budget)
  const remaining = budget.amount - budget.spent
  const over = remaining < 0
  const ratio = budget.amount > 0 ? budget.spent / budget.amount : 0
  const width = Math.min(ratio, 1) * 100
  const tracked =
    budget.category.categoryType === "income" ? "Received" : "Spent"

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: budget.category.color }}
          />
          <span className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-medium">{title}</span>
            <span className="text-sm text-muted-foreground">
              {formatDay(budget.startDate)} – {formatDay(budget.endDate)}
            </span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div className="px-2 text-right">
            <p className={`book-amount ${over ? "text-outflow" : ""}`}>
              {formatINR(Math.abs(remaining))}
            </p>
            <p className="text-sm text-muted-foreground">
              {remainderLabel(budget, remaining)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(budget)}
            aria-label={`Edit ${title}`}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteOpen(true)}
            aria-label={`Delete ${title}`}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 pl-6">
        <div
          role="meter"
          aria-valuemin={0}
          aria-valuemax={budget.amount}
          aria-valuenow={Math.min(budget.spent, budget.amount)}
          aria-label={`${tracked} ${formatINR(budget.spent)} of ${formatINR(budget.amount)}`}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <div
            className={`h-full ${over ? "bg-outflow" : "bg-inflow"}`}
            style={{ width: `${width}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {tracked} {formatINR(budget.spent)} of {formatINR(budget.amount)}
        </p>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {title}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the limit for {formatDay(budget.startDate)} to{" "}
              {formatDay(budget.endDate)}. Transactions stay as they are.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => deleteBudget(budget.id)}
            >
              {isDeleting ? <Spinner data-icon="inline-start" /> : null}
              Delete budget
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default BudgetItem
