import { BASE_URL } from "@/lib/Action/api/post.data.api";
import type { BookingRequestValues } from "@/lib/booking-validation";
import { BookingPayload } from "@/types/type";

export type CreateBookingRequest = BookingRequestValues & {
  serviceId: string;
};

type CreateBookingResponse = {
  message?: string;
  result?: unknown;
};

export async function createBookingRequest(
  payload:BookingPayload
): Promise<void> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const response = await fetch(`${BASE_URL}/add-booking`, {
    method: "POST",
    credentials: "include",
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
      data?.message ?? `Couldn't submit your repair request (${response.status}).`,
    );
  }
}
