import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createPosition as createPositionApi } from "@/services/positionService"
import type { PositionCreate } from "@/types/position"

export function useCreatePosition() {
  const queryClient = useQueryClient()

  const { mutate: createPosition, isPending: isCreating } = useMutation({
    mutationFn: (position: PositionCreate) => createPositionApi(position),
    onSuccess: () => {
      toast.success("Position added")
      queryClient.invalidateQueries({ queryKey: ["positions"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { createPosition, isCreating }
}
