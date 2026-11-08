import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { refreshLedger } from "@/features/ledger/refreshLedger"
import { createDebt as createDebtApi } from "@/services/debtService"

export function useCreateDebt() {
  const queryClient = useQueryClient()

  const { mutate: createDebt, isPending: isCreating } = useMutation({
    mutationFn: createDebtApi,
    onSuccess: () => {
      toast.success("Debt added")
      refreshLedger(queryClient)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { createDebt, isCreating }
}
