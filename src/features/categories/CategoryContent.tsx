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
import type { CategoryWithChild } from "@/types/categories"
import { timestampToDate } from "@/utils/dateCurrencyUtils"
import { useDeleteCategory } from "./useDeleteCategory"

interface CategoryContentProps {
  category: CategoryWithChild
  isChild: boolean
  handleEdit: (category: CategoryWithChild) => void
}

export function CategorySummary({
  category,
  isChild,
}: {
  category: CategoryWithChild
  isChild: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 text-left">
      <span
        className="size-3 shrink-0 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-medium">{category.categoryName}</span>
        {category.description ? (
          <span className="truncate text-sm font-normal text-muted-foreground">
            {category.description}
          </span>
        ) : null}
        <span className="text-sm font-normal text-muted-foreground capitalize">
          {timestampToDate(category.createdAt)}
          {!isChild && category.categoryType ? `, ${category.categoryType}` : ""}
        </span>
      </span>
    </div>
  )
}

export function CategoryActions({
  category,
  handleEdit,
}: {
  category: CategoryWithChild
  handleEdit: (category: CategoryWithChild) => void
}) {
  const { deleteCategory, isLoading: isDeleting } = useDeleteCategory()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const hasChildren = (category.child?.length ?? 0) > 0

  return (
    <>
      <div className="book-actions flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => handleEdit(category)}
          aria-label={`Edit ${category.categoryName}`}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setDeleteOpen(true)}
          aria-label={`Delete ${category.categoryName}`}
        >
          <Trash2 />
        </Button>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {category.categoryName}?</AlertDialogTitle>
            <AlertDialogDescription>
              {hasChildren
                ? "Nested categories stay in the list as top-level categories. Transactions in this category are left uncategorized, and budgets for it are removed."
                : "Transactions in this category are left uncategorized, and budgets for it are removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => deleteCategory(category.id)}
            >
              {isDeleting ? <Spinner data-icon="inline-start" /> : null}
              Delete category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function CategoryContent({ category, handleEdit, isChild }: CategoryContentProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <CategorySummary category={category} isChild={isChild} />
      <CategoryActions category={category} handleEdit={handleEdit} />
    </div>
  )
}

export default CategoryContent
