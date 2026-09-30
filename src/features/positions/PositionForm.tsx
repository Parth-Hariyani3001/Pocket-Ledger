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
import { Textarea } from "@/components/ui/textarea"
import type { PositionKind, PositionWithStatus } from "@/types/position"
import { positionKindLabel } from "./positionCopy"
import { useCreatePosition } from "./useCreatePosition"
import { useUpdatePosition } from "./useUpdatePosition"

interface PositionFormProps {
  editingPosition: PositionWithStatus | null
  onClose: () => void
}

const kinds: PositionKind[] = ["sip", "fd", "savings", "emergency"]

function PositionForm({ editingPosition, onClose }: PositionFormProps) {
  const { createPosition, isCreating } = useCreatePosition()
  const { updatePosition, isUpdating } = useUpdatePosition()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: editingPosition?.name ?? "",
      kind: editingPosition?.kind ?? "sip",
      notes: editingPosition?.notes ?? "",
      monthlyAmount: editingPosition?.monthlyAmount ?? "",
      marketValue: editingPosition?.marketValue ?? "",
      valuedOn: editingPosition?.valuedOn ?? "",
    },
  })

  const isBusy = isCreating || isUpdating

  function onSubmit(formData: FieldValues) {
    const monthlyRaw = String(formData.monthlyAmount ?? "").trim()
    const monthlyAmount = monthlyRaw === "" ? null : Number(monthlyRaw)
    if (monthlyAmount != null && (!Number.isFinite(monthlyAmount) || monthlyAmount <= 0)) return

    const marketRaw = String(formData.marketValue ?? "").trim()
    const valuedOn = String(formData.valuedOn ?? "").trim()
    const marketValue = marketRaw === "" ? null : Number(marketRaw)
    if (marketValue != null && (!Number.isFinite(marketValue) || marketValue < 0)) return
    if ((marketValue == null) !== (valuedOn === "")) return

    const position = {
      name: String(formData.name).trim(),
      kind: formData.kind as PositionKind,
      notes: String(formData.notes ?? "").trim() || null,
      monthly_amount: monthlyAmount,
      market_value: marketValue,
      valued_on: valuedOn || null,
    }

    if (!editingPosition) {
      createPosition(position, { onSuccess: onClose })
      return
    }

    updatePosition(
      { positionId: editingPosition.id, position },
      { onSuccess: onClose },
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{editingPosition ? "Edit position" : "Add a position"}</DialogTitle>
        <DialogDescription>
          A jar you still own, and how much you add every month. Contributions go in
          Transactions.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} id="position-form">
        <FieldGroup>
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="position-name">Name</FieldLabel>
            <Input
              id="position-name"
              type="text"
              placeholder="SIP"
              aria-invalid={errors.name ? true : undefined}
              {...register("name", { required: "Enter a name" })}
            />
            {errors.name?.message ? <FieldError>{String(errors.name.message)}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel>Kind</FieldLabel>
            <Controller
              control={control}
              name="kind"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {kinds.map((kind) => (
                        <SelectItem key={kind} value={kind}>
                          {positionKindLabel(kind)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field data-invalid={errors.monthlyAmount ? true : undefined}>
            <FieldLabel htmlFor="monthlyAmount">Each month</FieldLabel>
            <Input
              id="monthlyAmount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Optional"
              aria-invalid={errors.monthlyAmount ? true : undefined}
              {...register("monthlyAmount", {
                validate: (value) => {
                  const raw = String(value ?? "").trim()
                  if (!raw) return true
                  return Number(raw) > 0 || "Enter an amount greater than zero"
                },
              })}
            />
            <FieldDescription>How much you add in a typical month. The same amount every month.</FieldDescription>
            {errors.monthlyAmount?.message ? (
              <FieldError>{String(errors.monthlyAmount.message)}</FieldError>
            ) : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="position-notes">Note</FieldLabel>
            <Textarea id="position-notes" placeholder="Optional" {...register("notes")} />
          </Field>

          <Field data-invalid={errors.marketValue ? true : undefined}>
            <FieldLabel htmlFor="marketValue">Worth</FieldLabel>
            <Input
              id="marketValue"
              type="number"
              min="0"
              step="0.01"
              placeholder="Optional"
              aria-invalid={errors.marketValue ? true : undefined}
              {...register("marketValue", {
                validate: (value, formValues) => {
                  const raw = String(value ?? "").trim()
                  const dated = String(formValues.valuedOn ?? "").trim()
                  if (!raw && !dated) return true
                  if (!raw || !dated) return "A value needs the date you marked it"
                  return Number(raw) >= 0 || "Enter a value of zero or more"
                },
              })}
            />
            <FieldDescription>A mark of what it is worth. This is not money moving, and not income.</FieldDescription>
            {errors.marketValue?.message ? (
              <FieldError>{String(errors.marketValue.message)}</FieldError>
            ) : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="valuedOn">Marked on</FieldLabel>
            <Input id="valuedOn" type="date" {...register("valuedOn")} />
          </Field>
        </FieldGroup>
      </form>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
          Cancel
        </Button>
        <Button type="submit" form="position-form" disabled={isBusy}>
          {isBusy ? <Spinner data-icon="inline-start" /> : null}
          {editingPosition ? "Update position" : "Add position"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default PositionForm
