import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { Provider } from "@supabase/supabase-js";

import { signInWithOAuth as signInWithOAuthApi } from "../../services/authService"


export function useSignInOAuth() {
    const { mutate: signInWithOAuth, isPending: isLoading } = useMutation({
        mutationFn: (provider: Provider) => signInWithOAuthApi(provider),
        onError: (e) => toast.error(e.message)
    })

    return { signInWithOAuth, isLoading }
}