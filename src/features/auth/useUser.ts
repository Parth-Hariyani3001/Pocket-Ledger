import { useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { getSession } from "../../services/authService";

export function useUser() {
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: getSession,
    });

    useEffect(() => {
        if (error) toast.error(error.message)
    }, [error])

    return { user, isAuthenticated: !!user, isLoading }
}