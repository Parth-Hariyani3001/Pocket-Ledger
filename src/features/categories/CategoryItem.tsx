import { ChevronDown } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { CategoryWithChild } from "@/types/categories"
import CategoryContent, { CategoryActions, CategorySummary } from "./CategoryContent"

interface CategoryItemProps {
  category: CategoryWithChild
  handleEdit: (category: CategoryWithChild) => void
}

function CategoryItem({ category, handleEdit }: CategoryItemProps) {
  const childCategories = category.child ?? []

  if (!childCategories.length) {
    return (
      <div className="flex items-center gap-3 py-3">
        <span className="size-4 shrink-0" aria-hidden />
        <div className="min-w-0 flex-1">
          <CategoryContent
            category={category}
            handleEdit={handleEdit}
            isChild={false}
          />
        </div>
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={String(category.id)} className="border-0">
        <div className="flex items-center gap-2 py-3">
          <AccordionTrigger className="items-center justify-start gap-3 py-0 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/accordion-trigger:-rotate-180" />
            <CategorySummary category={category} isChild={false} />
          </AccordionTrigger>
          <CategoryActions category={category} handleEdit={handleEdit} />
        </div>
        <AccordionContent className="pb-2">
          <ul className="-mt-2 mb-2 ml-2 border-l border-border">
            {childCategories.map((child) => (
              <li key={child.id} className="py-2.5 pl-4">
                <CategoryContent
                  category={child}
                  handleEdit={handleEdit}
                  isChild
                />
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default CategoryItem
