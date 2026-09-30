import { Plus } from "lucide-react"

import PageHeading from "@/components/PageHeading"
import SegmentedFilter from "@/components/SegmentedFilter"
import { Button } from "@/components/ui/button"
import type { PositionWithStatus } from "@/types/position"
import { describePositions } from "./positionCopy"

interface PositionHeaderProps {
  positions: PositionWithStatus[]
  onAdd: () => void
}

function PositionHeader({ positions, onAdd }: PositionHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeading
        title="Positions"
        description={describePositions(positions)}
        action={
          <Button type="button" onClick={onAdd}>
            <Plus data-icon="inline-start" />
            Add position
          </Button>
        }
      />
      <div className="max-w-full overflow-x-auto">
        <SegmentedFilter
          paramKey="kind"
          defaultValue="all"
          options={[
            { label: "All", value: "all" },
            { label: "SIP", value: "sip" },
            { label: "FD", value: "fd" },
            { label: "Savings", value: "savings" },
            { label: "Emergency", value: "emergency" },
          ]}
        />
      </div>
    </div>
  )
}

export default PositionHeader
