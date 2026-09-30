import { Search } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

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
import BookLinesSkeleton from "@/components/BookLinesSkeleton"
import PositionForm from "@/features/positions/PositionForm"
import PositionHeader from "@/features/positions/PositionHeader"
import PositionItem from "@/features/positions/PositionItem"
import { positionKindLabel } from "@/features/positions/positionCopy"
import { usePositions } from "@/features/positions/usePositions"
import type { PositionKind, PositionWithStatus } from "@/types/position"

const kinds: PositionKind[] = ["sip", "fd", "savings", "emergency"]

function emptyCopy(hasAny: boolean, searching: boolean) {
  if (searching) {
    return {
      title: "No matching positions",
      description: "Try another name, or clear the search.",
    }
  }

  if (!hasAny) {
    return {
      title: "No positions yet",
      description: "Add a SIP, an FD, savings, or an emergency fund.",
    }
  }

  return {
    title: "Nothing in this view",
    description: "Try another kind, or add a position.",
  }
}

function PositionSection({
  title,
  positions,
  onEdit,
}: {
  title: string
  positions: PositionWithStatus[]
  onEdit: (position: PositionWithStatus) => void
}) {
  if (!positions.length) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="book-group">{title}</h2>
      <ul className="book-lines">
        {positions.map((position) => (
          <li key={position.id}>
            <PositionItem position={position} onEdit={onEdit} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function Positions() {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPosition, setEditingPosition] = useState<PositionWithStatus | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { positions, isLoading } = usePositions()

  const kind = searchParams.get("kind") ?? "all"
  const query = searchTerm.trim().toLowerCase()

  const visible = positions.filter((position) => {
    if (kind !== "all" && position.kind !== kind) return false
    if (query && !position.name.toLowerCase().includes(query)) return false
    return true
  })

  function closeForm() {
    setFormOpen(false)
    setEditingPosition(null)
  }

  function openCreate() {
    setEditingPosition(null)
    setFormOpen(true)
  }

  function openEdit(position: PositionWithStatus) {
    setEditingPosition(position)
    setFormOpen(true)
  }

  const empty = emptyCopy(positions.length > 0, Boolean(query))
  const showGroups = kind === "all"

  return (
    <div className="flex flex-col gap-8">
      <PositionHeader positions={positions} onAdd={openCreate} />

      <InputGroup className="max-w-xl">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search positions"
          type="text"
        />
      </InputGroup>

      {isLoading ? (
        <BookLinesSkeleton />
      ) : visible.length ? (
        showGroups ? (
          <div className="flex flex-col gap-8">
            {kinds.map((item) => (
              <PositionSection
                key={item}
                title={positionKindLabel(item)}
                positions={visible.filter((position) => position.kind === item)}
                onEdit={openEdit}
              />
            ))}
          </div>
        ) : (
          <ul className="book-lines">
            {visible.map((position) => (
              <li key={position.id}>
                <PositionItem position={position} onEdit={openEdit} />
              </li>
            ))}
          </ul>
        )
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{empty.title}</EmptyTitle>
            <EmptyDescription>{empty.description}</EmptyDescription>
          </EmptyHeader>
          {!query ? (
            <EmptyContent>
              <Button type="button" onClick={openCreate}>
                Add position
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <PositionForm
            key={editingPosition?.id ?? "new"}
            editingPosition={editingPosition}
            onClose={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Positions
