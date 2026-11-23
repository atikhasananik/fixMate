"use server";

import { BASE_URL, getAuthHeaders } from "@/lib/Action/api/shared";
import type { BookingStatus, UpdateBookingStatusResponse } from "@/types/type";

// Updates a booking status (customer cancels a requested booking).
export const updateBookingStatus = async (
  id: string,
  status: BookingStatus,
  finalAmount?: number,
): Promise<UpdateBookingStatusResponse> => {
  const payload = {
    status,
    ...(finalAmount !== undefined ? { finalAmount } : {}),
  };

  const res = await fetch(`${BASE_URL}/update-status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update the booking (${res.status}).`);
  }

  const data = (await res.json()) as UpdateBookingStatusResponse;
  if (data.success === false) {
    throw new Error(
      data.result?.message ?? data.message ?? `Couldn't update the booking.`,
    );
  }

  return data;
};
