import type {
  ServiceFormErrors,
  ServiceFormValues,
  SignInErrors,
  SignInValues,
  SignUpErrors,
  SignUpValues,
} from "@/types/type";

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

/** Validates the sign-in form. Password complexity is enforced at sign-up. */
export function validateSignIn(values: SignInValues): SignInErrors {
  const errors: SignInErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export const SERVICE_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const MAX_SERVICE_IMAGE_BYTES = 5 * 1024 * 1024;

/** Validates the technician service form before it reaches the store/API. */
export function validateServiceForm(
  values: ServiceFormValues,
  options: { requireImage?: boolean } = {}
): ServiceFormErrors {
  const errors: ServiceFormErrors = {};

  if (values.title.trim().length < 3) {
    errors.title = "Give the service a title of at least 3 characters.";
  }

  if (!values.category) {
    errors.category = "Choose a category.";
  }

  if (values.description.trim().length < 20) {
    errors.description = "Describe the work in at least 20 characters.";
  }

  const basePrice = Number(values.basePrice);

  if (!values.basePrice.trim() || Number.isNaN(basePrice) || basePrice <= 0) {
    errors.basePrice = "Enter a base price greater than 0.";
  }

  if (!values.estimatedDuration.trim()) {
    errors.estimatedDuration = "Add an estimated duration.";
  }

  if (!values.serviceArea.trim()) {
    errors.serviceArea = "Add the area you cover.";
  }

  if (options.requireImage && !values.image) {
    errors.image = "Upload a service image.";
  }

  return errors;
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
