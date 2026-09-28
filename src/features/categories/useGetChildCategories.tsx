import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "../../types/categories";
import { getChildCategories } from "../../services/categoryService";
import { toast } from "sonner";
import type { TransactionDirection } from "../../types/transactions";
import { useUser } from "../auth/useUser";

export function useGetChildCategories(direction: TransactionDirection | null) {
  const transactionDirection = direction
    ? direction === "outflow"
      ? "expense"
      : "income"
    : null;
  const { isAuthenticated } = useUser();

  const {
    data: childCategories,
    error,
    isLoading: isChildCategoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ["categories", "child", transactionDirection],
    queryFn: () => getChildCategories(transactionDirection),
    enabled: isAuthenticated && transactionDirection !== null,
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  return { childCategories, isChildCategoriesLoading };
}
