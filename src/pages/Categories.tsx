import { Search } from "lucide-react"
import { useState } from "react"

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
import CategoryForm from "@/features/categories/CategoryForm"
import CategoryHeader from "@/features/categories/CategoryHeader"
import CategoryItem from "@/features/categories/CategoryItem"
import { useCategories } from "@/features/categories/useCategories"
import type { Category, CategoryWithChild } from "@/types/categories"

function nestCategories(categories: Category[]): CategoryWithChild[] {
  const parents = new Map<number, CategoryWithChild>()
  const children: Category[] = []

  for (const category of categories) {
    if (!category.parentCategory) {
      parents.set(category.id, { ...category, child: [] })
    } else {
      children.push(category)
    }
  }

  const orphans: CategoryWithChild[] = []

  for (const child of children) {
    const parent = child.parentCategory
      ? parents.get(child.parentCategory)
      : undefined

    if (parent) parent.child?.push(child)
    else orphans.push({ ...child, child: [] })
  }

  return [...parents.values(), ...orphans]
}

function filterCategoryTree(
  categories: CategoryWithChild[],
  searchTerm: string,
): CategoryWithChild[] {
  const query = searchTerm.trim().toLowerCase()
  if (!query) return categories

  return categories.flatMap((category) => {
    const children = category.child ?? []
    const nameMatches = category.categoryName.toLowerCase().includes(query)
    const matchingChildren = children.filter((child) =>
      child.categoryName.toLowerCase().includes(query),
    )

    if (nameMatches) return [category]
    if (matchingChildren.length)
      return [{ ...category, child: matchingChildren }]
    return []
  })
}

function Categories() {
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithChild | null>(null)
  const { data: categories, isLoading } = useCategories()
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  function resetForm() {
    setShowEditModal(false)
  }

  const categoryTree = nestCategories(categories ?? [])
  const visibleCategories = filterCategoryTree(categoryTree, searchTerm)

  const handleShowModal = () => {
    setEditingCategory(null)
    setShowEditModal(true)
  }

  const handleEdit = (category: CategoryWithChild) => {
    setShowEditModal(true)
    setEditingCategory(category)
  }

  return (
    <div className="flex flex-col gap-8">
      <CategoryHeader
        handleShowModal={handleShowModal}
        categories={visibleCategories}
      />

      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search categories"
          type="text"
        />
      </InputGroup>

      {isLoading ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : visibleCategories.length ? (
        <ul className="book-lines">
          {visibleCategories.map((cat) => (
            <li key={cat.id}>
              <CategoryItem category={cat} handleEdit={handleEdit} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              {searchTerm ? "No matching categories" : "No categories yet"}
            </EmptyTitle>
            <EmptyDescription>
              {searchTerm
                ? "Try another word, or clear the search."
                : "Add a category to start organizing transactions."}
            </EmptyDescription>
          </EmptyHeader>
          {!searchTerm ? (
            <EmptyContent>
              <Button type="button" onClick={handleShowModal}>
                Add category
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      )}

      <Dialog
        open={showEditModal}
        onOpenChange={(open) => {
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <CategoryForm
            editingCategory={editingCategory}
            resetForm={resetForm}
            parentCategories={categoryTree}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Categories
