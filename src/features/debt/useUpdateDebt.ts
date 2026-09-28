import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateDebt as updateDebtApi } from "@/services/debtService"

export function useUpdateDebt() {
  const queryClient = useQueryClient()

  const { mutate: updateDebt, isPending: isUpdating } = useMutation({
    mutationFn: updateDebtApi,
    onSuccess: () => {
      toast.success("Debt updated")
      queryClient.invalidateQueries({ queryKey: ["debts"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { updateDebt, isUpdating }
}
