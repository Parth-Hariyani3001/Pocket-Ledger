import { Plus } from "lucide-react"

import PageHeading from "@/components/PageHeading"
import SegmentedFilter from "@/components/SegmentedFilter"
import { Button } from "@/components/ui/button"
import type { DebtWithBalance } from "@/types/debt"
import { describeDebts } from "./debtCopy"

interface DebtHeaderProps {
  debts: DebtWithBalance[]
  onAdd: () => void
}

function DebtHeader({ debts, onAdd }: DebtHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeading
        title="Debts"
        description={describeDebts(debts)}
        action={
          <Button type="button" onClick={onAdd}>
            <Plus data-icon="inline-start" />
            Add debt
          </Button>
        }
      />
      <SegmentedFilter
        paramKey="side"
        defaultValue="all"
        options={[
          { label: "All", value: "all" },
          { label: "I owe", value: "borrowed" },
          { label: "Owed to me", value: "lent" },
        ]}
      />
    </div>
  )
}

export default DebtHeader
