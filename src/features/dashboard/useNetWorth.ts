import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"

import { getNetWorthSeries } from "@/services/netWorthService"
import { useUser } from "../auth/useUser"

export function useNetWorth() {
  const { isAuthenticated } = useUser()

  const netWorth = useQuery({
    queryKey: ["net-worth"],
    queryFn: () => getNetWorthSeries(),
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (netWorth.error) toast.error(netWorth.error.message)
  }, [netWorth.error])

  return {
    closings: netWorth.data ?? [],
    isLoading: netWorth.isLoading,
  }
}
