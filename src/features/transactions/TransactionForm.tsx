import { format } from "date-fns"
import { Controller, useForm, type FieldValues } from "react-hook-form"
import { Link } from "react-router-dom"

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
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useGetChildCategories } from "@/features/categories/useGetChildCategories"
import { debtActionLabel, debtDirection, remainingLabel } from "@/features/debt/debtCopy"
import { useDebts } from "@/features/debt/useDebts"
import {
  positionActionLabel,
  positionActionOf,
  positionDirection,
  positionKindLabel,
} from "@/features/positions/positionCopy"
import { usePositions } from "@/features/positions/usePositions"
import type { DebtAction } from "@/types/debt"
import type { PositionAction } from "@/types/position"
import type { TransactionDirection, TransactionWithRef, TransactionWrite } from "@/types/transactions"
import { formatINR } from "@/utils/dateCurrencyUtils"
import { debtActionOf, entryKind, type EntryKind } from "./transactionCopy"
import { useCreateTransaction } from "./useCreateTransaction"
import { useUpdateTransaction } from "./useUpdateTransaction"

interface TransactionFormProps {
  editingTransaction: TransactionWithRef | null
  onClose: () => void
}

function directionFor(kind: EntryKind): TransactionDirection | null {
  if (kind === "spent") return "outflow"
  if (kind === "received") return "inflow"
  return null
}

function TransactionForm({ editingTransaction, onClose }: TransactionFormProps) {
  const today = format(new Date(), "yyyy-MM-dd")
  const { createTransaction, isCreating } = useCreateTransaction()
  const { updateTransaction, isUpdating } = useUpdateTransaction()
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: editingTransaction?.amount ?? undefined,
      transactionDate: editingTransaction?.transactionDate ?? today,
      description: editingTransaction?.description ?? "",
      kind: entryKind(editingTransaction),
      categoryId: editingTransaction?.categoryId ? String(editingTransaction.categoryId) : "",
      debtId: editingTransaction?.debtId ? String(editingTransaction.debtId) : "",
      debtAction: debtActionOf(editingTransaction?.debtType, editingTransaction?.direction),
      positionId: editingTransaction?.positionId ? String(editingTransaction.positionId) : "",
      positionAction: positionActionOf(editingTransaction?.direction),
    },
  })

  const kind = watch("kind") as EntryKind
  const selectedDebtId = watch("debtId")
  const selectedPositionId = watch("positionId")
  const direction = directionFor(kind)
  const recordingDebt = kind === "debt"
  const recordingPosition = kind === "position"

  const { childCategories, isChildCategoriesLoading } = useGetChildCategories(direction)
  const { debts, isLoading: isDebtsLoading } = useDebts(recordingDebt)
  const { positions, isLoading: isPositionsLoading } = usePositions(recordingPosition)
  const selectedDebt = debts.find((item) => String(item.id) === selectedDebtId)
  const selectedPosition = positions.find((item) => String(item.id) === selectedPositionId)
  const isBusy =
    isCreating ||
    isUpdating ||
    (direction !== null && isChildCategoriesLoading) ||
    (recordingDebt && isDebtsLoading) ||
    (recordingPosition && isPositionsLoading)
  const missingSubject =
    (direction !== null && !isChildCategoriesLoading && !childCategories?.length) ||
    (recordingDebt && !isDebtsLoading && !debts.length) ||
    (recordingPosition && !isPositionsLoading && !positions.length)

  function onSubmit(formData: FieldValues) {
    const amount = Number(formData.amount)
    if (!Number.isFinite(amount) || amount <= 0) return

    const description = String(formData.description ?? "").trim() || null
    const transactionDate = String(formData.transactionDate)
    const entry = formData.kind as EntryKind
    let transaction: TransactionWrite | null = null

    if (entry === "debt") {
      const debt = debts.find((item) => String(item.id) === formData.debtId)
      if (!debt) return
      transaction = {
        amount,
        description,
        transaction_date: transactionDate,
        direction: debtDirection(debt.debtType, formData.debtAction as DebtAction),
        debt_id: debt.id,
        category_id: null,
        position_id: null,
      }
    } else if (entry === "position") {
      const position = positions.find((item) => String(item.id) === formData.positionId)
      if (!position) return
      transaction = {
        amount,
        description,
        transaction_date: transactionDate,
        direction: positionDirection(formData.positionAction as PositionAction),
        position_id: position.id,
        category_id: null,
        debt_id: null,
      }
    } else {
      const categoryId = Number(formData.categoryId)
      if (!categoryId) return
      transaction = {
        amount,
        description,
        transaction_date: transactionDate,
        direction: entry === "spent" ? "outflow" : "inflow",
        category_id: categoryId,
        debt_id: null,
        position_id: null,
      }
    }

    if (!editingTransaction?.transactionId) {
      createTransaction(transaction, { onSuccess: onClose })
      return
    }

    updateTransaction(
      { transactionId: editingTransaction.transactionId, transaction },
      { onSuccess: onClose },
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingTransaction ? "Edit transaction" : "Add a transaction"}
        </DialogTitle>
        <DialogDescription>
          How much, when, and whether you spent it, received it, moved it for a debt, or added it to a position.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} id="transaction-form">
        <FieldGroup>
          <Field data-invalid={errors.amount ? true : undefined}>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0"
              aria-invalid={errors.amount ? true : undefined}
              {...register("amount", {
                required: "Enter an amount",
                validate: (value) =>
                  Number(value) > 0 || "Enter an amount greater than zero",
              })}
            />
            {errors.amount?.message ? (
              <FieldError>{String(errors.amount.message)}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={errors.transactionDate ? true : undefined}>
            <FieldLabel htmlFor="transactionDate">Date</FieldLabel>
            <Input
              id="transactionDate"
              type="date"
              aria-invalid={errors.transactionDate ? true : undefined}
              {...register("transactionDate", { required: "Choose a date" })}
            />
            {errors.transactionDate?.message ? (
              <FieldError>{String(errors.transactionDate.message)}</FieldError>
            ) : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Note</FieldLabel>
            <Input
              id="description"
              type="text"
              placeholder="Optional"
              {...register("description")}
            />
          </Field>

          <Field>
            <FieldLabel>What was it</FieldLabel>
            <Controller
              control={control}
              name="kind"
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  variant="outline"
                  spacing={0}
                  value={field.value}
                  onValueChange={(value) => {
                    if (!value) return
                    field.onChange(value)
                    setValue("categoryId", "")
                    setValue("debtId", "")
                    setValue("debtAction", "decrease")
                    setValue("positionId", "")
                    setValue("positionAction", "contribute")
                  }}
                >
                  <ToggleGroupItem value="spent">Spent</ToggleGroupItem>
                  <ToggleGroupItem value="received">Received</ToggleGroupItem>
                  <ToggleGroupItem value="debt">Debt</ToggleGroupItem>
                  <ToggleGroupItem value="position">Position</ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </Field>

          {direction ? (
            <Field data-invalid={errors.categoryId ? true : undefined}>
              <FieldLabel>Category</FieldLabel>
              {isChildCategoriesLoading ? (
                <Skeleton className="h-11 w-full" />
              ) : childCategories?.length ? (
                <Controller
                  control={control}
                  name="categoryId"
                  rules={{ required: "Choose a category" }}
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={errors.categoryId ? true : undefined}
                      >
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {childCategories.map((category) => (
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
                  <Link to="/categories" className="underline">
                    Add a category
                  </Link>{" "}
                  {kind === "spent" ? "for spending" : "for money you receive"} first.
                </FieldDescription>
              )}
              {errors.categoryId?.message ? (
                <FieldError>{String(errors.categoryId.message)}</FieldError>
              ) : null}
            </Field>
          ) : null}

          {recordingDebt ? (
            <Field data-invalid={errors.debtId ? true : undefined}>
              <FieldLabel>Who</FieldLabel>
              {isDebtsLoading ? (
                <Skeleton className="h-11 w-full" />
              ) : debts.length ? (
                <Controller
                  control={control}
                  name="debtId"
                  rules={{ required: "Choose a person" }}
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={errors.debtId ? true : undefined}
                      >
                        <SelectValue placeholder="Choose a person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {debts.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.counterparty}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <FieldDescription>
                  <Link to="/debts" className="underline">
                    Add a person
                  </Link>{" "}
                  before recording a payment.
                </FieldDescription>
              )}
              {selectedDebt ? (
                <FieldDescription>
                  {formatINR(Math.abs(selectedDebt.remaining))} {remainingLabel(selectedDebt)}
                </FieldDescription>
              ) : null}
              {errors.debtId?.message ? (
                <FieldError>{String(errors.debtId.message)}</FieldError>
              ) : null}
            </Field>
          ) : null}

          {recordingDebt && selectedDebt ? (
            <Field>
              <FieldLabel>What happened</FieldLabel>
              <Controller
                control={control}
                name="debtAction"
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
                    <ToggleGroupItem value="decrease">
                      {debtActionLabel(selectedDebt.debtType, "decrease")}
                    </ToggleGroupItem>
                    <ToggleGroupItem value="increase">
                      {debtActionLabel(selectedDebt.debtType, "increase")}
                    </ToggleGroupItem>
                  </ToggleGroup>
                )}
              />
            </Field>
          ) : null}

          {recordingPosition ? (
            <Field data-invalid={errors.positionId ? true : undefined}>
              <FieldLabel>Position</FieldLabel>
              {isPositionsLoading ? (
                <Skeleton className="h-11 w-full" />
              ) : positions.length ? (
                <Controller
                  control={control}
                  name="positionId"
                  rules={{ required: "Choose a position" }}
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={errors.positionId ? true : undefined}
                      >
                        <SelectValue placeholder="Choose a position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {positions.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <FieldDescription>
                  <Link to="/positions" className="underline">
                    Add a position
                  </Link>{" "}
                  before recording a contribution.
                </FieldDescription>
              )}
              {selectedPosition ? (
                <FieldDescription>
                  {positionKindLabel(selectedPosition.kind)} · {formatINR(selectedPosition.balance)}{" "}
                  contributed
                </FieldDescription>
              ) : null}
              {errors.positionId?.message ? (
                <FieldError>{String(errors.positionId.message)}</FieldError>
              ) : null}
            </Field>
          ) : null}

          {recordingPosition && selectedPosition ? (
            <Field>
              <FieldLabel>What happened</FieldLabel>
              <Controller
                control={control}
                name="positionAction"
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
                    <ToggleGroupItem value="contribute">
                      {positionActionLabel("contribute")}
                    </ToggleGroupItem>
                    <ToggleGroupItem value="withdraw">
                      {positionActionLabel("withdraw")}
                    </ToggleGroupItem>
                  </ToggleGroup>
                )}
              />
            </Field>
          ) : null}
        </FieldGroup>
      </form>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
          Cancel
        </Button>
        <Button type="submit" form="transaction-form" disabled={isBusy || missingSubject}>
          {isBusy ? <Spinner data-icon="inline-start" /> : null}
          {editingTransaction ? "Update transaction" : "Add transaction"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default TransactionForm
