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

export async function createBookingRequest(payload: BookingPayload) {
  // console.log(payload);

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

  const data = await response.json();
  
  return data

}
