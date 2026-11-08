import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createDebt as createDebtApi } from "@/services/debtService"

export function useCreateDebt() {
  const queryClient = useQueryClient()

  const { mutate: createDebt, isPending: isCreating } = useMutation({
    mutationFn: createDebtApi,
    onSuccess: () => {
      toast.success("Debt added")
      queryClient.invalidateQueries({ queryKey: ["debts"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { createDebt, isCreating }
}
