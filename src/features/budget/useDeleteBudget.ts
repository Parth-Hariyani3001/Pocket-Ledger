import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteBudget as deleteBudgetApi } from "@/services/budgetService"

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  const { mutate: deleteBudget, isPending: isDeleting } = useMutation({
    mutationFn: deleteBudgetApi,
    onSuccess: () => {
      toast.success("Budget deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { deleteBudget, isDeleting }
}
