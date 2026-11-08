import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { refreshLedger } from "@/features/ledger/refreshLedger"
import { createTransaction as createTransactionApi } from "@/services/transactionService"

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
