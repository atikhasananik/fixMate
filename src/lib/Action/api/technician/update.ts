"use server";

import { BASE_URL, getAuthHeaders } from "@/lib/Action/api/shared";
import type { ServiceFields } from "@/lib/service-payload";
import type {
  BookingStatus,
  UpdateBookingStatusResponse,
  UpdateServiceAvailabilityResponse,
} from "@/types/type";

export const updateServiceData = async (
  id: string,
  updatedServiceData: ServiceFields,
) => {
  const res = await fetch(`${BASE_URL}/update-service/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(updatedServiceData),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update the service (${res.status}).`);
  }

  return res.json();
};

export const updateServiceAvailability = async (
  id: string,
  isAvailable: boolean,
): Promise<UpdateServiceAvailabilityResponse> => {
  const res = await fetch(`${BASE_URL}/update-service-isavailable/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify({ isAvailable }),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update availability (${res.status}).`);
  }

  const data = (await res.json()) as UpdateServiceAvailabilityResponse;

  if (data.success === false) {
    throw new Error(
      data.result?.message ?? data.message ?? "Couldn't update availability.",
    );
  }

  if (data.result?.matchedCount === 0) {
    throw new Error("That service could not be found.");
  }

  return data;
};

export const updateBookingStatusByTechnician = async (
  id: string,
  status: BookingStatus,
  finalAmount?: number,
): Promise<UpdateBookingStatusResponse> => {
  const payload = {
    status,
    ...(finalAmount !== undefined ? { finalAmount } : {}),
  };

  const res = await fetch(`${BASE_URL}/update-status-by-technician/${id}`, {
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
