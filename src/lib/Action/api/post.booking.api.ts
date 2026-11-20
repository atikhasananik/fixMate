import { BASE_URL } from "@/lib/Action/api/post.data.api";
import type {
  BookingRequestPayload,
  CreateBookingResponse,
} from "@/types/type";

export async function createBookingRequest(
  payload: BookingRequestPayload,
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
