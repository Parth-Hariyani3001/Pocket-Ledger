import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteDebt as deleteDebtApi } from "@/services/debtService"

export function useDeleteDebt() {
  const queryClient = useQueryClient()

  const { mutate: deleteDebt, isPending: isDeleting } = useMutation({
    mutationFn: deleteDebtApi,
    onSuccess: () => {
      toast.success("Debt deleted")
      queryClient.invalidateQueries({ queryKey: ["debts"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { deleteDebt, isDeleting }
}
