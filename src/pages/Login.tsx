import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm, type FieldValues } from "react-hook-form"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import AuthFormFooter from "@/features/auth/AuthFormFooter"
import AuthShell from "@/features/auth/AuthShell"
import { useSignIn } from "@/features/auth/useSignIn"
import { useSignInOAuth } from "@/features/auth/useSignInOAuth"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()

  const { signin, isLoading: isLoadingEmail } = useSignIn()
  const { signInWithOAuth, isLoading: isLoadingOAuth } = useSignInOAuth()
  const isLoading = isLoadingEmail || isLoadingOAuth

  const handleGoogleSignIn = async () => {
    signInWithOAuth("google")
    reset()
  }

  const onLogin = async (formData: FieldValues) => {
    const { email, password } = formData
    signin({ email, password }, { onSettled: () => reset() })
  }

  return (
    <AuthShell>
      <div className="site-auth-form">
        <div>
          <h1>Sign in</h1>
          <p className="site-auth-lead">Use the email on your book.</p>
        </div>

        <form onSubmit={handleSubmit(onLogin)} id="sign-in-form">
          <FieldGroup className="gap-5">
            <Field data-invalid={errors.email ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={errors.email ? true : undefined}
                {...register("email", {
                  required: "Enter an email",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email?.message ? (
                <FieldError>{String(errors.email.message)}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={errors.password ? true : undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  aria-invalid={errors.password ? true : undefined}
                  {...register("password", {
                    required: "Enter a password",
                    minLength: {
                      value: 8,
                      message: "Use at least 8 characters",
                    },
                  })}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    onClick={() => setShowPassword((shown) => !shown)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.password?.message ? (
                <FieldError>{String(errors.password.message)}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </form>

        <div className="site-auth-actions">
          <button
            type="submit"
            form="sign-in-form"
            className="site-pill site-auth-submit"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : null}
            Sign in
          </button>
          <p className="site-auth-or">or</p>
          <button
            type="button"
            className="site-auth-alt"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <GoogleMark />
            Sign in with Google
          </button>
          <AuthFormFooter
            pathTo="/signup"
            message="No account yet?"
            destination="Create one"
          />
        </div>
      </div>
    </AuthShell>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default Login
