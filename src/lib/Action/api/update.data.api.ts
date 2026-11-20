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
): Promise<UpdateBookingStatusResponse> => {
  const res = await fetch(`${BASE_URL}/update-status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update the service (${res.status}).`);
  }

  return (await res.json()) as UpdateBookingStatusResponse;
};
