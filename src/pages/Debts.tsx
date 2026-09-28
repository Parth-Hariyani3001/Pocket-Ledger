import { Search } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import DebtForm from "@/features/debt/DebtForm"
import DebtHeader from "@/features/debt/DebtHeader"
import DebtItem from "@/features/debt/DebtItem"
import { useDebts } from "@/features/debt/useDebts"
import type { DebtWithBalance } from "@/types/debt"

function byName(a: DebtWithBalance, b: DebtWithBalance) {
  const aOpen = a.remaining !== 0
  const bOpen = b.remaining !== 0
  if (aOpen !== bOpen) return aOpen ? -1 : 1
  return a.counterparty.localeCompare(b.counterparty)
}

function emptyCopy(hasAny: boolean, searching: boolean) {
  if (searching) {
    return {
      title: "No matching debts",
      description: "Try another name, or clear the search.",
    }
  }

  if (!hasAny) {
    return {
      title: "No debts yet",
      description: "Add someone you owe, or someone who owes you.",
    }
  }

  return {
    title: "Nothing in this view",
    description: "Try the other side, or add a debt.",
  }
}

function DebtSection({
  title,
  debts,
  onEdit,
}: {
  title: string
  debts: DebtWithBalance[]
  onEdit: (debt: DebtWithBalance) => void
}) {
  if (!debts.length) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm text-muted-foreground">{title}</h2>
      <ul className="book-lines">
        {debts.map((debt) => (
          <li key={debt.id}>
            <DebtItem debt={debt} onEdit={onEdit} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function Debts() {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingDebt, setEditingDebt] = useState<DebtWithBalance | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { debts, isLoading } = useDebts()

  const side = searchParams.get("side") ?? "all"
  const query = searchTerm.trim().toLowerCase()

  const visible = debts
    .filter((debt) => {
      if (side !== "all" && debt.debtType !== side) return false
      if (query && !debt.counterparty.toLowerCase().includes(query)) return false
      return true
    })
    .sort(byName)

  const borrowed = visible.filter((debt) => debt.debtType === "borrowed")
  const lent = visible.filter((debt) => debt.debtType === "lent")

  function closeForm() {
    setFormOpen(false)
    setEditingDebt(null)
  }

  function openCreate() {
    setEditingDebt(null)
    setFormOpen(true)
  }

  function openEdit(debt: DebtWithBalance) {
    setEditingDebt(debt)
    setFormOpen(true)
  }

  const empty = emptyCopy(debts.length > 0, Boolean(query))
  const showGroups = side === "all"

  return (
    <div className="flex flex-col gap-8">
      <DebtHeader debts={debts} onAdd={openCreate} />

      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search debts"
          type="text"
        />
      </InputGroup>

      {isLoading ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : visible.length ? (
        showGroups ? (
          <div className="flex flex-col gap-8">
            <DebtSection title="I owe" debts={borrowed} onEdit={openEdit} />
            <DebtSection title="Owed to me" debts={lent} onEdit={openEdit} />
          </div>
        ) : (
          <ul className="book-lines">
            {visible.map((debt) => (
              <li key={debt.id}>
                <DebtItem debt={debt} onEdit={openEdit} />
              </li>
            ))}
          </ul>
        )
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{empty.title}</EmptyTitle>
            <EmptyDescription>{empty.description}</EmptyDescription>
          </EmptyHeader>
          {!query ? (
            <EmptyContent>
              <Button type="button" onClick={openCreate}>
                Add debt
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm()
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DebtForm
            key={editingDebt?.id ?? "new"}
            editingDebt={editingDebt}
            onClose={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Debts