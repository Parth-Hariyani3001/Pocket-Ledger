import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { refreshLedger } from "@/features/ledger/refreshLedger"
import { updateTransaction as updateTransactionApi } from "@/services/transactionService"
import type { TransactionWrite } from "@/types/transactions"

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
