import { Plus } from "lucide-react"

import PageHeading from "@/components/PageHeading"
import SegmentedFilter from "@/components/SegmentedFilter"
import { Button } from "@/components/ui/button"

interface TransactionHeaderProps {
  onAdd: () => void
}

function TransactionHeader({ onAdd }: TransactionHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeading
        title="Transactions"
        description="Money you spent, received, or moved for a debt."
        action={
          <Button type="button" onClick={onAdd}>
            <Plus data-icon="inline-start" />
            Add transaction
          </Button>
        }
      />
      <div className="max-w-full overflow-x-auto">
        <SegmentedFilter
          paramKey="kind"
          defaultValue="all"
          options={[
            { label: "All", value: "all" },
            { label: "Spent", value: "spent" },
            { label: "Received", value: "received" },
            { label: "Debts", value: "debt" },
          ]}
        />
      </div>
    </div>
  )
}

export default TransactionHeader
