import { BASE_URL } from "./post.data.api";
import type {
  BookingStatus,
  CustomerBooking,
  PaymentStatus,
  ServiceApiItem,
} from "@/types/type";

type GetServicesResponse = {
  status?: number;
  message?: string;
  result?: ServiceApiItem[];
};

/** Fetches the services that belong to one technician from the Express API. */
export async function getServiceData(
  technicianEmail: string,
): Promise<ServiceApiItem[]> {
  const res = await fetch(
    `${BASE_URL}/get-services/${encodeURIComponent(technicianEmail)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error(`Couldn't load your services (${res.status}).`);
  }

  const data = (await res.json()) as GetServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

// Every service listing, used by the public services page.
export async function getAllServiceData(): Promise<ServiceApiItem[]> {
  const res = await fetch(`${BASE_URL}/get-all-services`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Couldn't load services (${res.status}).`);
  }

  const data = (await res.json()) as GetServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

// get single service data

export const getSingleServiceData = async (
  id: string,
): Promise<ServiceApiItem | null> => {
  const res = await fetch(`${BASE_URL}/get-single-service/${id}`);

  if (!res.ok) {
    throw new Error(`Couldn't load services (${res.status}).`);
  }

  const data = (await res.json()) as {
    status?: number;
    message?: string;
    result?: ServiceApiItem | ServiceApiItem[];
  };

  if (Array.isArray(data.result)) {
    return data.result.find((service) => service._id === id) ?? null;
  }

  return data.result ?? null;
};


type BookingApiDocument = {
  _id?: string;
  id?: string;
  serviceTitle?: string;
  serviceImage?: string;
  category?: string;
  technicianName?: string;
  preferredDate?: string;
  basePrice?: number | string;
  finalAmount?: number | string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
};

type GetBookingsResponse = {
  message?: string;
  result?: BookingApiDocument[] | { bookings?: BookingApiDocument[] };
};

const BOOKING_STATUSES: BookingStatus[] = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

function toCustomerBooking(item: BookingApiDocument): CustomerBooking {
  const id = item._id ?? item.id;
  const basePrice = Number(item.basePrice);
  const finalAmount =
    item.finalAmount == null ? undefined : Number(item.finalAmount);

  if (!id || !Number.isFinite(basePrice)) {
    throw new Error("The bookings response contains an invalid booking.");
  }

  if (item.status && !BOOKING_STATUSES.includes(item.status)) {
    throw new Error(`Unknown booking status: ${item.status}`);
  }

  if (
    item.paymentStatus &&
    item.paymentStatus !== "paid" &&
    item.paymentStatus !== "unpaid"
  ) {
    throw new Error(`Unknown payment status: ${item.paymentStatus}`);
  }

  return {
    id,
    serviceTitle: item.serviceTitle || "Repair service",
    technicianName: item.technicianName || "Technician not assigned",
    preferredDate: item.preferredDate || "",
    basePrice,
    ...(finalAmount !== undefined && Number.isFinite(finalAmount)
      ? { finalAmount }
      : {}),
    status: item.status ?? "requested",
    paymentStatus: item.paymentStatus ?? "unpaid",
    category: item.category,
    serviceImage: item.serviceImage,
  };
}

export async function getBookingData(
  email: string,
): Promise<CustomerBooking[]> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const res = await fetch(
    `${BASE_URL}/get-bookings/${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );
  const data = (await res.json().catch(() => null)) as
    | GetBookingsResponse
    | BookingApiDocument[]
    | null;

  if (!res.ok) {
    const message =
      data && !Array.isArray(data) ? data.message : undefined;
    throw new Error(message ?? `Couldn't load bookings (${res.status}).`);
  }

  const result = Array.isArray(data)
    ? data
    : Array.isArray(data?.result)
      ? data.result
      : data?.result?.bookings;

  if (!result) {
    throw new Error("The bookings API returned an unexpected response.");
  }

  return result.map(toCustomerBooking);
}