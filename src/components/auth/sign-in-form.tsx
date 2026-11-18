"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { signIn } from "@/lib/auth-client";
import { getRoleDashboardPath } from "@/lib/nav";
import { validateSignIn } from "@/lib/validation";
import type { SignInErrors, SignInFormProps, SignInValues } from "@/types/type";

const INITIAL_VALUES: SignInValues = {
  email: "",
  password: "",
};

export function SignInForm({ redirectTo, googleEnabled }: SignInFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<SignInValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function setField<K extends keyof SignInValues>(
    field: K,
    value: SignInValues[K]
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));

    setErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous
    );
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setField(name as keyof SignInValues, value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateSignIn(values);
    setErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0];

    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await signIn.email({
      email: values.email.trim(),
      password: values.password,
    });

    if (error) {
      setIsSubmitting(false);
      toast.add({
        type: "error",
        title: "Unable to sign in",
        description:
          error.message ?? "Check your email and password and try again.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Welcome back",
      description: "Signing you in…",
    });

    router.push(redirectTo ?? getRoleDashboardPath(data?.user?.role));
    router.refresh();
  }

  return (
    <AuthPageShell
      title="Sign in to FixMate"
      description="Welcome back — manage your repairs, bookings, and payments in one place."
      footer={
        <>
          New to FixMate?
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
          >
            Create an account
          </Link>
        </>
      }
    >
      {googleEnabled ? (
        <>
          <GoogleSignInButton callbackURL={redirectTo ?? "/dashboard"} />

          <div className="relative my-6">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        </>
      ) : null}

      <form noValidate onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-10 px-3"
            />
            <FieldError id="email-error">{errors.email}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.password)}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="h-10 pr-10 pl-3"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls="password"
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            <FieldError id="password-error">{errors.password}</FieldError>
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </FieldGroup>
      </form>
    </AuthPageShell>
  );
}
