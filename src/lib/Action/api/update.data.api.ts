import { BASE_URL } from "./post.data.api";
import type { ServiceFields } from "@/lib/service-payload";
import type {
  BookingStatus,
  UpdateBookingStatusResponse,
} from "@/types/type";

export const updateServiceData = async (
  id: string,
  updatedServiceData: ServiceFields,
) => {
  const res = await fetch(`${BASE_URL}/update-service/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedServiceData),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update the service (${res.status}).`);
  }

  return res.json();
};

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
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update the booking (${res.status}).`);
  }

  const data = (await res.json()) as UpdateBookingStatusResponse;
  if (data.success === false) {
    throw new Error(
      data.result?.message ?? data.message ?? "Couldn't update the booking.",
    );
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
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update the booking (${res.status}).`);
  }

  const data = (await res.json()) as UpdateBookingStatusResponse;
  if (data.success === false) {
    throw new Error(
      data.result?.message ?? data.message ?? "Couldn't update the booking.",
    );
  }

  return data;
};