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
import { useSignUp } from "@/features/auth/useSignUp"

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm()
  const { signup, isLoading } = useSignUp()

  const onSubmit = (formData: FieldValues) => {
    const { fullName, email, password } = formData
    signup({ fullName, email, password })
  }

  return (
    <AuthShell>
      <div className="site-auth-form">
        <div>
          <h1>Create an account</h1>
          <p className="site-auth-lead">
            The book starts empty. You write the first line.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} id="sign-up-form">
          <FieldGroup className="gap-5">
            <Field data-invalid={errors.fullName ? true : undefined}>
              <FieldLabel htmlFor="fullName">Name</FieldLabel>
              <Input
                id="fullName"
                type="text"
                placeholder="Your name"
                aria-invalid={errors.fullName ? true : undefined}
                {...register("fullName", {
                  required: "Enter your name",
                  minLength: {
                    value: 1,
                    message: "Enter your name",
                  },
                })}
              />
              {errors.fullName?.message ? (
                <FieldError>{String(errors.fullName.message)}</FieldError>
              ) : null}
            </Field>

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
                  placeholder="At least 8 characters"
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

            <Field data-invalid={errors.confirmPassword ? true : undefined}>
              <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat the password"
                  aria-invalid={errors.confirmPassword ? true : undefined}
                  {...register("confirmPassword", {
                    required: "Confirm the password",
                    validate: (value: string) =>
                      value === getValues().password || "Passwords need to match",
                  })}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    onClick={() => setShowConfirmPassword((shown) => !shown)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.confirmPassword?.message ? (
                <FieldError>{String(errors.confirmPassword.message)}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </form>

        <div className="site-auth-actions">
          <button
            type="submit"
            form="sign-up-form"
            className="site-pill site-auth-submit"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : null}
            Create account
          </button>
          <AuthFormFooter
            pathTo="/signin"
            message="Already have an account?"
            destination="Sign in"
          />
        </div>
      </div>
    </AuthShell>
  )
}

export default Signup
