import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { signin as signinApi } from "./../../services/authService";

import { toast } from "sonner";

interface LoginTypes {
    email: string;
    password: string;
}

export function useSignIn() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: signin, isPending: isLoading } = useMutation({
        mutationFn: ({ email, password }: LoginTypes) => signinApi(email, password),
        onSuccess: ({ user, session }) => {
            if (!session) {
                queryClient.setQueryData(['user'], null)
                toast.error("Sign-in did not start a session.")
                return
            }

            queryClient.setQueryData(['user'], user)
            navigate("/")
        },
        onError: (e) => toast.error(e.message)
    });

    return { signin, isLoading }
}