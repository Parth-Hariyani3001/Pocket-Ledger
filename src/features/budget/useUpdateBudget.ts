import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateBudget as updateBudgetApi } from "@/services/budgetService"

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  const { mutate: updateBudget, isPending: isUpdating } = useMutation({
    mutationFn: updateBudgetApi,
    onSuccess: () => {
      toast.success("Budget updated successfully")
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { updateBudget, isUpdating }
}
