import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"

import { getPositions } from "@/services/positionService"
import type { PositionWithStatus } from "@/types/position"
import { useUser } from "../auth/useUser"

export function usePositions(enabled = true) {
  const { isAuthenticated } = useUser()

  const { data, error, isLoading } = useQuery<PositionWithStatus[]>({
    queryKey: ["positions"],
    queryFn: getPositions,
    enabled: isAuthenticated && enabled,
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return {
    positions: data ?? [],
    isLoading,
  }
}
