import { format } from "date-fns"
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
import BookLinesSkeleton from "@/components/BookLinesSkeleton"
import BudgetForm from "@/features/budget/BudgetForm"
import BudgetHeader from "@/features/budget/BudgetHeader"
import BudgetItem from "@/features/budget/BudgetItem"
import { budgetTitle } from "@/features/budget/budgetCopy"
import { useBudgets } from "@/features/budget/useBudgets"
import type { BudgetWithUsage } from "@/types/budget"

function matchesWhen(
  range: { startDate: string; endDate: string },
  when: string,
  today: string,
) {
  if (when === "upcoming") return range.startDate > today
  if (when === "past") return range.endDate < today
  if (when === "active") return range.startDate <= today && range.endDate >= today
  return true
}

function emptyCopy(hasAny: boolean, searching: boolean) {
  if (searching) {
    return {
      title: "No matching budgets",
      description: "Try another word, or clear the search.",
    }
  }

  if (!hasAny) {
    return {
      title: "No budgets yet",
      description: "Add a limit for a parent category and the dates it should cover.",
    }
  }

  return {
    title: "No budgets in this view",
    description: "Try another filter, or add a limit for these dates.",
  }
}

function Budget() {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingBudget, setEditingBudget] = useState<BudgetWithUsage | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { budgets, categories, isLoading } = useBudgets()

  const when = searchParams.get("when") ?? "active"
  const type = searchParams.get("type") ?? "all"
  const today = format(new Date(), "yyyy-MM-dd")
  const query = searchTerm.trim().toLowerCase()

  const visible = budgets.filter((budget) => {
    if (type !== "all" && budget.category.categoryType !== type) return false
    if (!matchesWhen(budget, when, today)) return false
    if (query && !budgetTitle(budget).toLowerCase().includes(query)) return false
    return true
  })

  const described = budgets.filter((budget) => {
    if (type !== "all" && budget.category.categoryType !== type) return false
    return matchesWhen(budget, when, today)
  })

  function closeForm() {
    setFormOpen(false)
    setEditingBudget(null)
  }

  function openCreate() {
    setEditingBudget(null)
    setFormOpen(true)
  }

  function openEdit(budget: BudgetWithUsage) {
    setEditingBudget(budget)
    setFormOpen(true)
  }

  const empty = emptyCopy(budgets.length > 0, Boolean(query))

  return (
    <div className="flex flex-col gap-8">
      <BudgetHeader budgets={described} onAdd={openCreate} />

      <InputGroup className="max-w-xl">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search budgets"
          type="text"
        />
      </InputGroup>

      {isLoading ? (
        <BookLinesSkeleton />
      ) : visible.length ? (
        <ul className="book-lines">
          {visible.map((budget) => (
            <li key={budget.id}>
              <BudgetItem budget={budget} onEdit={openEdit} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{empty.title}</EmptyTitle>
            <EmptyDescription>{empty.description}</EmptyDescription>
          </EmptyHeader>
          {!query ? (
            <EmptyContent>
              <Button type="button" onClick={openCreate}>
                Add budget
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
        <DialogContent className="sm:max-w-md">
          <BudgetForm
            key={editingBudget?.id ?? "new"}
            editingBudget={editingBudget}
            budgets={budgets}
            categories={categories}
            onClose={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Budget
