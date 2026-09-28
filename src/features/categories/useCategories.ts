import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/categories";
import { useUser } from "../auth/useUser";

import { toast } from "sonner";

export function useCategories() {
    const [searchParams] = useSearchParams();
    const categoryType = searchParams.get('type') ?? 'all';
    const { isAuthenticated } = useUser();

    const { data, error, isLoading } = useQuery<Category[]>({
        queryKey: ['categories', categoryType],
        queryFn: () => getCategories(categoryType),
        enabled: isAuthenticated,
    })

    useEffect(() => {
        if (error) toast.error(error.message)
    }, [error])

    return { data, isLoading }
}