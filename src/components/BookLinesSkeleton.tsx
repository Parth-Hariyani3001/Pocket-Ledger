import { Skeleton } from "@/components/ui/skeleton"

function BookLinesSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="book-lines" aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center justify-between gap-6 py-3.5">
          <Skeleton className="h-4 w-36 max-w-[46%]" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  )
}

export default BookLinesSkeleton
