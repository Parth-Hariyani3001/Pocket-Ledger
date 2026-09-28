import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteTransaction as deleteTransactionApi } from "@/services/transactionService"

function refreshLedger(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["transactions"] })
  queryClient.invalidateQueries({ queryKey: ["debts"] })
  queryClient.invalidateQueries({ queryKey: ["budgets"] })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  const { mutate: deleteTransaction, isPending: isDeleting } = useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: () => {
      toast.success("Transaction deleted")
      refreshLedger(queryClient)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { deleteTransaction, isDeleting }
}
