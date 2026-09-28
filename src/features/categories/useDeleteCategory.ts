import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory as deleteCategoryApi } from "../../services/categoryService";
import { toast } from "sonner";

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    const { mutate: deleteCategory, isPending: isLoading } = useMutation({
        mutationFn: deleteCategoryApi,
        onSuccess: () => {
            toast.success('Category deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: (err) => {
            toast.error(err.message)
        }
    });

    return { deleteCategory, isLoading }
}