import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updatePosition as updatePositionApi } from "@/services/positionService"
import type { PositionUpdate } from "@/types/position"

interface UpdatePositionInput {
  positionId: number
  position: PositionUpdate
}

export function useUpdatePosition() {
  const queryClient = useQueryClient()

  const { mutate: updatePosition, isPending: isUpdating } = useMutation({
    mutationFn: ({ positionId, position }: UpdatePositionInput) =>
      updatePositionApi({ positionId, position }),
    onSuccess: () => {
      toast.success("Position updated")
      queryClient.invalidateQueries({ queryKey: ["positions"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { updatePosition, isUpdating }
}
