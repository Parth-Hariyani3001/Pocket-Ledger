import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory as updateCategoryApi } from "../../services/categoryService";
import { toast } from "sonner";

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    const { mutate: updateCategory, isPending: isUpdating } = useMutation({
        mutationFn: updateCategoryApi,
        onSuccess: () => {
            toast.success('Category Updated successfully')
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: (err) => {
            toast.error(err.message)
        }
    });

    return { updateCategory, isUpdating }
}