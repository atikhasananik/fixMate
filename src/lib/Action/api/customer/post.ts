import { BASE_URL } from "@/lib/Action/api/shared";
import type {
  BookingData,
  CreateBookingResponse,
  CreatePaymentIntentResponse,
} from "@/types/type";

export async function createBookingRequest(
  payload: BookingData,
): Promise<CreateBookingResponse> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const response = await fetch(`${BASE_URL}/add-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as
    | CreateBookingResponse
    | null;

  if (!response.ok) {
    throw new Error(
      data?.result?.message ??
        data?.message ??
        `Couldn't submit your repair request (${response.status}).`,
    );
  }

  if (!data || typeof data.success !== "boolean") {
    throw new Error("The booking API returned an unexpected response.");
  }

  return data;
}

// Creates a Stripe Checkout session for a booking so the customer can pay.
export async function createPaymentIntent(
  payload: { bookingId: string },
): Promise<CreatePaymentIntentResponse> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const res = await fetch(`${BASE_URL}/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => null)) as
    | CreatePaymentIntentResponse
    | null;

  if (!res.ok) {
    const message = data?.message;
    throw new Error(message ?? `Couldn't create the payment (${res.status}).`);
  }

  if (!data || typeof data.success !== "boolean") {
    throw new Error("The payment API returned an unexpected response.");
  }

  return data;
}
