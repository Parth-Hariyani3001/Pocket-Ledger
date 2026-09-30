import { useQuery } from "@tanstack/react-query"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { useEffect } from "react"
import { toast } from "sonner"

import { getCategories } from "@/services/categoryService"
import { getMonthTransactions } from "@/services/transactionService"
import type { Category } from "@/types/categories"
import { useUser } from "../auth/useUser"
import { summarizeMonth } from "./summarizeMonth"

export function monthRange(month: Date) {
  const start = startOfMonth(month)
  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(endOfMonth(month), "yyyy-MM-dd"),
    label: format(start, "MMMM yyyy"),
  }
}

export function useMonthActivity(month: Date) {
  const { isAuthenticated } = useUser()
  const range = monthRange(month)

  const activity = useQuery({
    queryKey: ["month-activity", range.start],
    queryFn: () => getMonthTransactions(range.start, range.end),
    enabled: isAuthenticated,
  })

  const categories = useQuery<Category[]>({
    queryKey: ["categories", "all"],
    queryFn: () => getCategories("all"),
    enabled: isAuthenticated,
  })

  const error = activity.error ?? categories.error

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  const summary = summarizeMonth(activity.data ?? [], categories.data ?? [], month)

  return {
    summary,
    label: range.label,
    isLoading: activity.isLoading || categories.isLoading,
  }
}
