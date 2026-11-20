import type {
  BookingRequestErrors,
  BookingRequestValues,
} from "@/types/type";

export type { BookingRequestErrors, BookingRequestValues } from "@/types/type";

export function getTodayDateInputValue(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function validateBookingRequest(
  values: BookingRequestValues,
  today = getTodayDateInputValue(),
): BookingRequestErrors {
  const errors: BookingRequestErrors = {};

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!values.address.trim()) {
    errors.address = "Address is required.";
  }

  if (!values.preferredDate) {
    errors.preferredDate = "Choose a preferred date.";
  } else if (values.preferredDate < today) {
    errors.preferredDate = "Choose today or a future date.";
  }

  if (!values.problemDescription.trim()) {
    errors.problemDescription = "Describe the repair issue.";
  } else if (values.problemDescription.trim().length < 20) {
    errors.problemDescription =
      "Describe the issue in at least 20 characters.";
  }

  return errors;
}

export function isValidBookingRequest(values: BookingRequestValues): boolean {
  return Object.keys(validateBookingRequest(values)).length === 0;
}
