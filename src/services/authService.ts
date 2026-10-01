import type { Provider } from "@supabase/supabase-js";
import supabase from "./supabase";

export async function signup(fullName: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email, password, options: {
            data: {
                fullName
            }
        }
    });

    if (error)
        throw new Error(error.message);

    return data;
}

export async function signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error)
        throw new Error(error.message);

    return data;
}

export async function signInWithOAuth(authProvider: Provider) {
    const redirectTo =
        window.location.hostname === "localhost"
            ? window.location.origin
            : import.meta.env.VITE_OAUTH_REDIRECT_URL || window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: authProvider,
        options: {
            redirectTo,
        },
    })

    if (error)
        throw new Error(error.message)

    return data;
}

export async function signout() {
    const { error } = await supabase.auth.signOut();

    if (error)
        throw new Error(error.message)
}

export async function getSession() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;

    return session.session.user;
}