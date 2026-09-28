import { endOfMonth, format, startOfMonth } from "date-fns"
import { Controller, useForm, type FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import type { BudgetCategoryOption, BudgetCreate, BudgetWithUsage } from "@/types/budget"
import { useCreateBudget } from "./useCreateBudget"
import { useUpdateBudget } from "./useUpdateBudget"

interface BudgetFormProps {
  editingBudget: BudgetWithUsage | null
  budgets: BudgetWithUsage[]
  categories: BudgetCategoryOption[]
  onClose: () => void
}

function monthBounds() {
  const today = new Date()
  return {
    startDate: format(startOfMonth(today), "yyyy-MM-dd"),
    endDate: format(endOfMonth(today), "yyyy-MM-dd"),
  }
}

function overlaps(
  startDate: string,
  endDate: string,
  budget: BudgetWithUsage,
) {
  return startDate <= budget.endDate && budget.startDate <= endDate
}

function BudgetForm({
  editingBudget,
  budgets,
  categories,
  onClose,
}: BudgetFormProps) {
  const defaults = monthBounds()
  const { createBudget, isCreating } = useCreateBudget()
  const { updateBudget, isUpdating } = useUpdateBudget()
  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: editingBudget?.amount ?? undefined,
      categoryId: editingBudget ? String(editingBudget.categoryId) : "",
      startDate: editingBudget?.startDate ?? defaults.startDate,
      endDate: editingBudget?.endDate ?? defaults.endDate,
    },
  })

  const selectedId = Number(watch("categoryId"))
  const parents = categories.filter((category) => category.parentCategory == null)
  const selected = parents.find((category) => category.id === selectedId)
  const hasChildren = categories.some(
    (category) => category.parentCategory === selected?.id,
  )
  const isBusy = isCreating || isUpdating
  const options = [...parents].sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName),
  )

  function onSubmit(formData: FieldValues) {
    const categoryId = Number(formData.categoryId)
    const amount = Number(formData.amount)
    const startDate = String(formData.startDate)
    const endDate = String(formData.endDate)

    if (!parents.some((category) => category.id === categoryId)) return
    if (!Number.isFinite(amount) || amount <= 0) return

    const clash = budgets.some(
      (budget) =>
        budget.id !== editingBudget?.id &&
        budget.categoryId === categoryId &&
        overlaps(startDate, endDate, budget),
    )

    if (clash) {
      setError("endDate", {
        message: "This category already has a budget in these dates.",
      })
      return
    }

    const budget: BudgetCreate = {
      category_id: categoryId,
      amount,
      start_date: startDate,
      end_date: endDate,
    }

    if (!editingBudget) {
      createBudget(budget, { onSuccess: onClose })
      return
    }

    updateBudget(
      { budgetId: editingBudget.id, budget },
      { onSuccess: onClose },
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{editingBudget ? "Edit budget" : "Add a budget"}</DialogTitle>
        <DialogDescription>
          A parent category, a limit, and the dates it covers.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} id="budget-form">
        <FieldGroup>
          <Field data-invalid={errors.categoryId ? true : undefined}>
            <FieldLabel>Parent category</FieldLabel>
            {options.length ? (
              <Controller
                control={control}
                name="categoryId"
                rules={{ required: "Choose a parent category" }}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full" aria-invalid={errors.categoryId ? true : undefined}>
                      <SelectValue placeholder="Choose a parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {options.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <FieldDescription>
                Add a parent category before setting a limit.
              </FieldDescription>
            )}
            {hasChildren ? (
              <FieldDescription>
                Spending includes nested categories.
              </FieldDescription>
            ) : null}
            {errors.categoryId?.message ? (
              <FieldError>{String(errors.categoryId.message)}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={errors.amount ? true : undefined}>
            <FieldLabel htmlFor="amount">Limit</FieldLabel>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0"
              aria-invalid={errors.amount ? true : undefined}
              {...register("amount", {
                required: "Enter an amount",
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: "Enter an amount greater than zero",
                },
              })}
            />
            {errors.amount?.message ? (
              <FieldError>{String(errors.amount.message)}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={errors.startDate ? true : undefined}>
            <FieldLabel htmlFor="startDate">Start</FieldLabel>
            <Input
              id="startDate"
              type="date"
              aria-invalid={errors.startDate ? true : undefined}
              {...register("startDate", { required: "Choose a start date" })}
            />
            {errors.startDate?.message ? (
              <FieldError>{String(errors.startDate.message)}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={errors.endDate ? true : undefined}>
            <FieldLabel htmlFor="endDate">End</FieldLabel>
            <Input
              id="endDate"
              type="date"
              aria-invalid={errors.endDate ? true : undefined}
              {...register("endDate", {
                required: "Choose an end date",
                validate: (value, formValues) =>
                  String(value) >= String(formValues.startDate) ||
                  "The end date has to be on or after the start date",
              })}
            />
            {errors.endDate?.message ? (
              <FieldError>{String(errors.endDate.message)}</FieldError>
            ) : null}
          </Field>
        </FieldGroup>
      </form>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
          Cancel
        </Button>
        <Button type="submit" form="budget-form" disabled={isBusy || !options.length}>
          {isBusy ? <Spinner data-icon="inline-start" /> : null}
          {editingBudget ? "Update budget" : "Add budget"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default BudgetForm
