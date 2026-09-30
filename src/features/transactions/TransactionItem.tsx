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
import type { TransactionWithRef } from "@/types/transactions"
import { lineTitle, signedAmount } from "./transactionCopy"
import { useDeleteTransaction } from "./useDeleteTransaction"

interface TransactionItemProps {
  transaction: TransactionWithRef
  onEdit: (transaction: TransactionWithRef) => void
}

function TransactionItem({ transaction, onEdit }: TransactionItemProps) {
  const { deleteTransaction, isDeleting } = useDeleteTransaction()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const title = lineTitle(transaction)
  const isDebt = transaction.transactionType === "debt"
  const isPosition = transaction.transactionType === "position"

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate">{title}</p>
        {transaction.description ? (
          <p className="truncate text-sm text-muted-foreground">{transaction.description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <p
          className={`book-amount ${
            transaction.direction === "inflow" ? "text-inflow" : "text-outflow"
          }`}
        >
          {signedAmount(Number(transaction.amount), transaction.direction)}
        </p>
        <div className="book-actions flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(transaction)}
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

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {title}?</AlertDialogTitle>
            <AlertDialogDescription>
              {isDebt
                ? "This also changes what is left with this person."
                : isPosition
                  ? "This also changes how much you have contributed."
                  : "This removes the line from your book."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting || transaction.transactionId == null}
              onClick={() => {
                if (transaction.transactionId != null) deleteTransaction(transaction.transactionId)
              }}
            >
              {isDeleting ? <Spinner data-icon="inline-start" /> : null}
              Delete transaction
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TransactionItem
