import { format } from "date-fns"
import { Controller, useForm, type FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { DebtCreate, DebtWithBalance } from "@/types/debt"
import { useCreateDebt } from "./useCreateDebt"
import { useUpdateDebt } from "./useUpdateDebt"

interface DebtFormProps {
  editingDebt: DebtWithBalance | null
  onClose: () => void
}

function DebtForm({ editingDebt, onClose }: DebtFormProps) {
  const today = format(new Date(), "yyyy-MM-dd")
  const { createDebt, isCreating } = useCreateDebt()
  const { updateDebt, isUpdating } = useUpdateDebt()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      counterparty: editingDebt?.counterparty ?? "",
      debtType: editingDebt?.debtType ?? "borrowed",
      principal: editingDebt?.principal ?? undefined,
      startDate: editingDebt?.startDate ?? today,
      dueDate: editingDebt?.dueDate ?? "",
    },
  })

  const isBusy = isCreating || isUpdating

  function onSubmit(formData: FieldValues) {
    const principal = Number(formData.principal)
    if (!Number.isFinite(principal) || principal <= 0) return

    const debt: DebtCreate = {
      counterparty: String(formData.counterparty).trim(),
      debt_type: formData.debtType,
      principal,
      start_date: String(formData.startDate),
      due_date: formData.dueDate ? String(formData.dueDate) : null,
    }

    if (!editingDebt) {
      createDebt(debt, { onSuccess: onClose })
      return
    }

    updateDebt({ debtId: editingDebt.id, debt }, { onSuccess: onClose })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{editingDebt ? "Edit debt" : "Add a debt"}</DialogTitle>
        <DialogDescription>
          Who it is with, and what is already open. Payments go in Transactions.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} id="debt-form">
        <FieldGroup>
          <Field data-invalid={errors.counterparty ? true : undefined}>
            <FieldLabel htmlFor="counterparty">Who</FieldLabel>
            <Input
              id="counterparty"
              type="text"
              placeholder="Name"
              aria-invalid={errors.counterparty ? true : undefined}
              {...register("counterparty", { required: "Enter a name" })}
            />
            {errors.counterparty?.message ? (
              <FieldError>{String(errors.counterparty.message)}</FieldError>
            ) : null}
          </Field>

          <Field>
            <FieldLabel>Which way</FieldLabel>
            <Controller
              control={control}
              name="debtType"
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  variant="outline"
                  spacing={0}
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value)
                  }}
                >
                  <ToggleGroupItem value="borrowed">I borrowed</ToggleGroupItem>
                  <ToggleGroupItem value="lent">I lent</ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </Field>

          <Field data-invalid={errors.principal ? true : undefined}>
            <FieldLabel htmlFor="principal">Starting amount</FieldLabel>
            <Input
              id="principal"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0"
              aria-invalid={errors.principal ? true : undefined}
              {...register("principal", {
                required: "Enter an amount",
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: "Enter an amount greater than zero",
                },
              })}
            />
            {errors.principal?.message ? (
              <FieldError>{String(errors.principal.message)}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={errors.startDate ? true : undefined}>
            <FieldLabel htmlFor="startDate">Started</FieldLabel>
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

          <Field data-invalid={errors.dueDate ? true : undefined}>
            <FieldLabel htmlFor="dueDate">Due</FieldLabel>
            <Input
              id="dueDate"
              type="date"
              aria-invalid={errors.dueDate ? true : undefined}
              {...register("dueDate", {
                validate: (value, formValues) =>
                  !value ||
                  String(value) >= String(formValues.startDate) ||
                  "The due date has to be on or after the start date",
              })}
            />
            {errors.dueDate?.message ? (
              <FieldError>{String(errors.dueDate.message)}</FieldError>
            ) : null}
          </Field>
        </FieldGroup>
      </form>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
          Cancel
        </Button>
        <Button type="submit" form="debt-form" disabled={isBusy}>
          {isBusy ? <Spinner data-icon="inline-start" /> : null}
          {editingDebt ? "Update debt" : "Add debt"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default DebtForm
