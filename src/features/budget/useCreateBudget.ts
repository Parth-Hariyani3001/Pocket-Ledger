import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createBudget as createBudgetApi } from "@/services/budgetService"

export function useCreateBudget() {
  const queryClient = useQueryClient()

  const { mutate: createBudget, isPending: isCreating } = useMutation({
    mutationFn: createBudgetApi,
    onSuccess: () => {
      toast.success("Budget created successfully")
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { createBudget, isCreating }
}
