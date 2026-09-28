import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory as createCategoryApi } from "../../services/categoryService";
import { toast } from "sonner";

export function useCreateCategory() {
    const queryClient = useQueryClient();

    const { mutate: createCategory, isPending: isCreating } = useMutation({
        mutationFn: createCategoryApi,
        onSuccess: () => {
            toast.success('Category created successfully')
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: (err) => {
            toast.error(err.message)
        }
    });

    return { createCategory, isCreating }
}