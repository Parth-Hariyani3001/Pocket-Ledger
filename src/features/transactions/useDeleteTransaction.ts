import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { refreshLedger } from "@/features/ledger/refreshLedger"
import { deleteTransaction as deleteTransactionApi } from "@/services/transactionService"

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
