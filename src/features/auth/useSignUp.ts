import { useMutation, useQueryClient } from "@tanstack/react-query";

import { signup as signupApi } from "../../services/authService.ts"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SignupType {
    fullName: string;
    email: string;
    password: string;
}

export function useSignUp() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: signup, isPending: isLoading } = useMutation({
        mutationFn: ({ fullName, email, password }: SignupType) => signupApi(fullName, email, password),
        onSuccess: ({ user, session }) => {
            if (!session) {
                queryClient.setQueryData(['user'], null)
                toast.success("Confirm your email, then sign in.")
                navigate("/signin")
                return
            }

            queryClient.setQueryData(['user'], user)
            navigate("/")
        },
        onError: (e) => toast.error(e.message)
    })

    return { signup, isLoading }
}