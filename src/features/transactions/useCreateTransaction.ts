import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createTransaction as createTransactionApi } from "@/services/transactionService"

function refreshLedger(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["transactions"] })
  queryClient.invalidateQueries({ queryKey: ["debts"] })
  queryClient.invalidateQueries({ queryKey: ["budgets"] })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  const { mutate: createTransaction, isPending: isCreating } = useMutation({
    mutationFn: createTransactionApi,
    onSuccess: () => {
      toast.success("Transaction added")
      refreshLedger(queryClient)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { createTransaction, isCreating }
}
