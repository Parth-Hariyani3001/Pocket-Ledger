import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signout as signoutApi } from "../../services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useSignOut() {
    const navigate = useNavigate();
    const client = useQueryClient();

    const { mutate: signout, isPending: isLoading } = useMutation({
        mutationFn: signoutApi,
        onSuccess: () => {
            client.clear()
            navigate('/signin')
        },
        onError: (e) => toast.error(e.message),
    });

    return { signout, isLoading }
}