import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import Pagination from "@/components/Pagination"
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
import TransactionForm from "@/features/transactions/TransactionForm"
import TransactionHeader from "@/features/transactions/TransactionHeader"
import TransactionList from "@/features/transactions/TransactionList"
import useTransactions from "@/features/transactions/useTransactions"
import { asTransactionFilter } from "@/services/transactionService"
import type { TransactionFilter, TransactionWithRef } from "@/types/transactions"

function emptyCopy(filter: TransactionFilter, searching: boolean) {
  if (searching) {
    return {
      title: "No matching transactions",
      description: "Try another word, or clear the search.",
    }
  }

  if (filter === "spent") {
    return {
      title: "Nothing spent yet",
      description: "Money you spend will show up here.",
    }
  }

  if (filter === "received") {
    return {
      title: "Nothing received yet",
      description: "Money you receive will show up here.",
    }
  }

  if (filter === "debt") {
    return {
      title: "No debt payments yet",
      description: "Payments and new borrowing show up here.",
    }
  }

  return {
    title: "No transactions yet",
    description: "Add money you spent, received, or moved for a debt.",
  }
}

function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "")
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithRef | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { transactions, count, isLoading } = useTransactions()

  const filter = asTransactionFilter(searchParams.get("kind"))
  const searching = Boolean(searchParams.get("q")?.trim())

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          const next = searchTerm.trim()
          if ((params.get("q") ?? "") === next) return current
          if (next) params.set("q", next)
          else params.delete("q")
          params.delete("page")
          return params
        },
        { replace: true },
      )
    }, 250)

    return () => window.clearTimeout(handle)
  }, [searchTerm, setSearchParams])

  function closeForm() {
    setFormOpen(false)
    setEditingTransaction(null)
  }

  function openCreate() {
    setEditingTransaction(null)
    setFormOpen(true)
  }

  function openEdit(transaction: TransactionWithRef) {
    setEditingTransaction(transaction)
    setFormOpen(true)
  }

  const empty = emptyCopy(filter, searching)

  return (
    <div className="flex flex-col gap-8">
      <TransactionHeader onAdd={openCreate} />

      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search notes, categories, or people"
          type="text"
        />
      </InputGroup>

      {isLoading ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : transactions.length ? (
        <div className="flex flex-col gap-4">
          <TransactionList transactions={transactions} onEdit={openEdit} />
          <Pagination count={count} />
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{empty.title}</EmptyTitle>
            <EmptyDescription>{empty.description}</EmptyDescription>
          </EmptyHeader>
          {!searching ? (
            <EmptyContent>
              <Button type="button" onClick={openCreate}>
                Add transaction
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
          <TransactionForm
            key={editingTransaction?.transactionId ?? "new"}
            editingTransaction={editingTransaction}
            onClose={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Transactions
