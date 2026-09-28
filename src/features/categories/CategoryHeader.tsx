import { Plus } from "lucide-react"

import PageHeading from "@/components/PageHeading"
import SegmentedFilter from "@/components/SegmentedFilter"
import { Button } from "@/components/ui/button"
import type { CategoryWithChild } from "@/types/categories"

interface CategoryHeaderProps {
  categories: CategoryWithChild[]
  handleShowModal: () => void
}

function CategoryHeader({ categories, handleShowModal }: CategoryHeaderProps) {
  const childCount = categories.reduce(
    (acc, cat) => acc + (cat.child?.length ?? 0),
    0,
  )
  const parentCount = categories.length

  return (
    <div className="flex flex-col gap-4">
      <PageHeading
        title="Categories"
        description={`${parentCount} parent, ${childCount} nested.`}
        action={
          <Button type="button" onClick={handleShowModal}>
            <Plus data-icon="inline-start" />
            Add category
          </Button>
        }
      />
      <SegmentedFilter
        paramKey="type"
        defaultValue="all"
        options={[
          { label: "All", value: "all" },
          { label: "Income", value: "income" },
          { label: "Expense", value: "expense" },
        ]}
      />
    </div>
  )
}

export default CategoryHeader
