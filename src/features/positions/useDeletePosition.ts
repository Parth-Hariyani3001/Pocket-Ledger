import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deletePosition as deletePositionApi } from "@/services/positionService"

export function useDeletePosition() {
  const queryClient = useQueryClient()

  const { mutate: deletePosition, isPending: isDeleting } = useMutation({
    mutationFn: deletePositionApi,
    onSuccess: () => {
      toast.success("Position deleted")
      queryClient.invalidateQueries({ queryKey: ["positions"] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { deletePosition, isDeleting }
}
