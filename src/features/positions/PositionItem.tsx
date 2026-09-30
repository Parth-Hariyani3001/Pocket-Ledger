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
import type { PositionWithStatus } from "@/types/position"
import { formatINR } from "@/utils/dateCurrencyUtils"
import { monthLine, positionKindLabel } from "./positionCopy"
import { useDeletePosition } from "./useDeletePosition"

interface PositionItemProps {
  position: PositionWithStatus
  onEdit: (position: PositionWithStatus) => void
}

function formatDay(value: string) {
  return format(parseISO(value), "d MMM yyyy")
}

function PositionItem({ position, onEdit }: PositionItemProps) {
  const { deletePosition, isDeleting } = useDeletePosition()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const progress = monthLine(position)

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate font-medium">{position.name}</p>
        <p className="text-sm text-muted-foreground">
          {positionKindLabel(position.kind)}
          {progress ? <span> · {progress}</span> : null}
        </p>
        {position.marketValue != null && position.valuedOn ? (
          <p className="text-sm text-muted-foreground">
            Worth {formatINR(position.marketValue)} as of {formatDay(position.valuedOn)}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="px-2 text-right">
          <p className="book-amount">{formatINR(position.balance)}</p>
          <p className="text-sm text-muted-foreground">contributed</p>
        </div>
        <div className="book-actions flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(position)}
          aria-label={`Edit ${position.name}`}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setDeleteOpen(true)}
          aria-label={`Delete ${position.name}`}
        >
          <Trash2 />
        </Button>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {position.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the position. Transactions that belong to it have to be removed first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => deletePosition(position.id)}
            >
              {isDeleting ? <Spinner data-icon="inline-start" /> : null}
              Delete position
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default PositionItem
