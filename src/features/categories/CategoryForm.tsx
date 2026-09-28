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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type {
  CategoryCreate,
  CategoryType,
  CategoryWithChild,
} from "@/types/categories"
import { colors } from "@/utils/colorList"
import { useCreateCategory } from "./useCreateCategory"
import { useUpdateCategory } from "./useUpdateCategory"

interface CategoryFormProps {
  editingCategory: CategoryWithChild | null
  parentCategories: CategoryWithChild[]
  resetForm: () => void
}

const categoryTypeList: CategoryType[] = ["expense", "income"]
const noParent = "none"

function CategoryForm({
  editingCategory,
  parentCategories,
  resetForm,
}: CategoryFormProps) {
  const { createCategory, isCreating } = useCreateCategory()
  const { updateCategory, isUpdating } = useUpdateCategory()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryName: editingCategory?.categoryName ?? "",
      color: editingCategory?.color ?? colors[0],
      categoryDescription: editingCategory?.description ?? "",
      categoryType:
        editingCategory && "categoryType" in editingCategory
          ? editingCategory.categoryType
          : categoryTypeList[0],
      categorySelector: editingCategory?.parentCategory
        ? String(editingCategory.parentCategory)
        : noParent,
    },
  })

  const selectedColor = watch("color")
  const selectedCategory = watch("categorySelector")
  const hasChildren = (editingCategory?.child?.length ?? 0) > 0
  const isBusy = isCreating || isUpdating
  const parentOptions = parentCategories.filter(
    (category) => category.id !== editingCategory?.id,
  )

  function onSubmit(formData: FieldValues) {
    const selectedParentId = hasChildren
      ? null
      : formData.categorySelector === noParent
        ? null
        : Number(formData.categorySelector)

    const parentCategory =
      selectedParentId == null
        ? null
        : parentCategories.find((category) => category.id === selectedParentId)

    if (selectedParentId != null && Number.isNaN(selectedParentId)) return
    if (editingCategory && selectedParentId === editingCategory.id) return

    const categoryType: CategoryType | undefined = parentCategory
      ? parentCategory.categoryType
      : formData.categoryType

    if (categoryType !== "income" && categoryType !== "expense") return

    const data: CategoryCreate = {
      category_name: formData.categoryName,
      color: formData.color ?? colors[0],
      description: formData.categoryDescription || null,
      parent_category: parentCategory?.id ?? (hasChildren ? null : selectedParentId),
      category_type: categoryType,
    }

    if (!editingCategory) {
      createCategory(data, { onSuccess: resetForm })
      return
    }

    updateCategory(
      { category: data, categoryId: editingCategory.id },
      { onSuccess: resetForm },
    )
  }

  const showType = hasChildren || selectedCategory === noParent

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingCategory ? "Edit category" : "Add a category"}
        </DialogTitle>
        <DialogDescription>
          A name, a color, and whether it sits under another category.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} id="category-form">
        <FieldGroup>
          <Field data-invalid={errors.categoryName ? true : undefined}>
            <FieldLabel htmlFor="categoryName">Name</FieldLabel>
            <Input
              id="categoryName"
              type="text"
              placeholder="Groceries"
              aria-invalid={errors.categoryName ? true : undefined}
              {...register("categoryName", {
                required: "Enter a name",
                minLength: {
                  value: 3,
                  message: "Use at least 3 characters",
                },
              })}
            />
            {errors.categoryName?.message ? (
              <FieldError>{String(errors.categoryName.message)}</FieldError>
            ) : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="categoryDescription">Note</FieldLabel>
            <Input
              id="categoryDescription"
              type="text"
              placeholder="Optional"
              {...register("categoryDescription")}
            />
          </Field>

          {hasChildren ? null : (
            <Field>
              <FieldLabel>Parent</FieldLabel>
              <Controller
                control={control}
                name="categorySelector"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={noParent}>None</SelectItem>
                        {parentOptions.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          )}

          {showType ? (
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Controller
                control={control}
                name="categoryType"
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
                    <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
                    <ToggleGroupItem value="income">Income</ToggleGroupItem>
                  </ToggleGroup>
                )}
              />
              {hasChildren ? (
                <FieldDescription>
                  Nested categories use this type.
                </FieldDescription>
              ) : null}
            </Field>
          ) : null}

          <Field>
            <FieldLabel>Color</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  onClick={() => setValue("color", color, { shouldValidate: true })}
                  className={`size-8 rounded-full border-2 ${
                    selectedColor === color ? "border-brass" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </Field>
        </FieldGroup>
      </form>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={resetForm} disabled={isBusy}>
          Cancel
        </Button>
        <Button type="submit" form="category-form" disabled={isBusy}>
          {isBusy ? <Spinner data-icon="inline-start" /> : null}
          {editingCategory ? "Update category" : "Add category"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default CategoryForm
