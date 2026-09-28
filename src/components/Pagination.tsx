import { ChevronsLeft, ChevronsRight } from "lucide-react"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { PAGE_SIZE } from "@/utils/constants"

interface PaginationProps {
  count: number
}

function Pagination({ count }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"))
  const pageCount = Math.ceil(count / PAGE_SIZE)

  useEffect(() => {
    if (pageCount <= 1 && searchParams.has("page")) {
      const params = new URLSearchParams(searchParams)
      params.delete("page")
      setSearchParams(params)
    }
  }, [pageCount, searchParams, setSearchParams])

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1
    searchParams.set("page", String(next))
    setSearchParams(searchParams)
  }

  function previousPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1
    searchParams.set("page", String(prev))
    setSearchParams(searchParams)
  }

  if (pageCount <= 1) return null

  const from = (currentPage - 1) * PAGE_SIZE + 1
  const to = currentPage === pageCount ? count : currentPage * PAGE_SIZE

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from} to {to} of {count}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={previousPage}
          disabled={currentPage === 1}
        >
          <ChevronsLeft data-icon="inline-start" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          Next
          <ChevronsRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
