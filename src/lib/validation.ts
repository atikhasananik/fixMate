import type { SignUpErrors, SignUpValues } from "@/types/type";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 6;

/**
 * Returns the first unmet password rule, or `null` when the password is valid.
 * Keep the minimum length in sync with `minPasswordLength` in `src/lib/auth.ts`.
 */
export function getPasswordError(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include a lowercase letter.";
  }

  return null;
}

/** Validates the sign-up form and returns a message per invalid field. */
export function validateSignUp(values: SignUpValues): SignUpErrors {
  const errors: SignUpErrors = {};

  if (!values.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else {
    const passwordError = getPasswordError(values.password);

    if (passwordError) {
      errors.password = passwordError;
    }
  }

  return errors;
}
