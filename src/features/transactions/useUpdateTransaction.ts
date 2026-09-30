import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateTransaction as updateTransactionApi } from "@/services/transactionService"
import type { TransactionWrite } from "@/types/transactions"

function refreshLedger(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["transactions"] })
  queryClient.invalidateQueries({ queryKey: ["debts"] })
  queryClient.invalidateQueries({ queryKey: ["budgets"] })
  queryClient.invalidateQueries({ queryKey: ["positions"] })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  const { mutate: updateTransaction, isPending: isUpdating } = useMutation({
    mutationFn: ({
      transactionId,
      transaction,
    }: {
      transactionId: number
      transaction: TransactionWrite
    }) => updateTransactionApi(transactionId, transaction),
    onSuccess: () => {
      toast.success("Transaction updated")
      refreshLedger(queryClient)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { updateTransaction, isUpdating }
}
