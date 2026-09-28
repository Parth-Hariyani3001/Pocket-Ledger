import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"

import { getBudgets } from "@/services/budgetService"
import type { BudgetList } from "@/types/budget"
import { useUser } from "../auth/useUser"

export function useBudgets() {
  const { isAuthenticated } = useUser()

  const { data, error, isLoading } = useQuery<BudgetList>({
    queryKey: ["budgets"],
    queryFn: getBudgets,
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return {
    budgets: data?.budgets ?? [],
    categories: data?.categories ?? [],
    isLoading,
  }
}
