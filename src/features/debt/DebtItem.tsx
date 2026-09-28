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
import type { DebtWithBalance } from "@/types/debt"
import { formatINR } from "@/utils/dateCurrencyUtils"
import { debtSideLabel, remainingLabel } from "./debtCopy"
import { useDeleteDebt } from "./useDeleteDebt"

interface DebtItemProps {
  debt: DebtWithBalance
  onEdit: (debt: DebtWithBalance) => void
}

function formatDay(value: string) {
  return format(parseISO(value), "d MMM yyyy")
}

function DebtItem({ debt, onEdit }: DebtItemProps) {
  const { deleteDebt, isDeleting } = useDeleteDebt()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const today = format(new Date(), "yyyy-MM-dd")
  const overdue = Boolean(debt.dueDate && debt.dueDate < today && debt.remaining > 0)
  const open = debt.remaining !== 0

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate font-medium">{debt.counterparty}</p>
        <p className="text-sm text-muted-foreground">
          {debtSideLabel(debt.debtType)}
          {debt.dueDate ? (
            <span className={overdue ? "text-outflow" : undefined}>
              {" "}
              · due {formatDay(debt.dueDate)}
            </span>
          ) : null}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="px-2 text-right">
          <p className={`book-amount ${open ? "" : "text-muted-foreground"}`}>
            {formatINR(Math.abs(debt.remaining))}
          </p>
          <p className="text-sm text-muted-foreground">{remainingLabel(debt)}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(debt)}
          aria-label={`Edit ${debt.counterparty}`}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setDeleteOpen(true)}
          aria-label={`Delete ${debt.counterparty}`}
        >
          <Trash2 />
        </Button>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {debt.counterparty}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the debt. Transactions that belong to them have to be
              removed first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => deleteDebt(debt.id)}
            >
              {isDeleting ? <Spinner data-icon="inline-start" /> : null}
              Delete debt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DebtItem
