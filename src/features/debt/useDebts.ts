import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"

import { getDebts } from "@/services/debtService"
import type { DebtWithBalance } from "@/types/debt"
import { useUser } from "../auth/useUser"

export function useDebts(enabled = true) {
  const { isAuthenticated } = useUser()

  const { data, error, isLoading } = useQuery<DebtWithBalance[]>({
    queryKey: ["debts"],
    queryFn: getDebts,
    enabled: isAuthenticated && enabled,
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return {
    debts: data ?? [],
    isLoading,
  }
}
