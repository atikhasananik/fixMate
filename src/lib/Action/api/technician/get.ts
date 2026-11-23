import { BASE_URL, getAuthHeaders } from "@/lib/Action/api/shared";
import type {
  BookingStatus,
  GetTechnicianBookingRequestsResponse,
  ServiceApiItem,
  TechnicianBooking,
  TechnicianBookingApiDocument,
} from "@/types/type";

const BOOKING_STATUSES: BookingStatus[] = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

const isBookingStatus = (status: string): status is BookingStatus =>
  BOOKING_STATUSES.includes(status as BookingStatus);

function toTechnicianBooking(
  item: TechnicianBookingApiDocument,
): TechnicianBooking {
  const id = item._id ?? item.id;
  const basePrice = Number(item.basePrice);
  const finalAmount =
    item.finalAmount == null ? undefined : Number(item.finalAmount);

  if (!id || !item.technicianEmail || !Number.isFinite(basePrice)) {
    throw new Error("The booking requests response contains invalid data.");
  }

  if (!item.status || !isBookingStatus(item.status)) {
    throw new Error(`Unknown booking status: ${item.status ?? "missing"}`);
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
    technicianEmail: item.technicianEmail,
    customerName: item.customerName || "Name not provided",
    phone: item.phone || item.customerPhone || "Not provided",
    address: item.address || "Not provided",
    preferredDate: item.preferredDate || "",
    problemDescription: item.problemDescription || "No description provided.",
    serviceTitle: item.serviceTitle || "Repair service",
    status: item.status,
    basePrice,
    ...(finalAmount !== undefined && Number.isFinite(finalAmount)
      ? { finalAmount }
      : {}),
    paymentStatus: item.paymentStatus ?? "unpaid",
  };
}

/** Fetches the services that belong to one technician from the Express API. */
export async function getServiceData(
  technicianEmail: string,
): Promise<ServiceApiItem[]> {
  const res = await fetch(
    `${BASE_URL}/get-services/${encodeURIComponent(technicianEmail)}`,
    { cache: "no-store", headers: await getAuthHeaders() },
  );

  if (!res.ok) {
    throw new Error(`Couldn't load your services (${res.status}).`);
  }

  const data = (await res.json()) as { result?: ServiceApiItem[] };

  return Array.isArray(data.result) ? data.result : [];
}

export async function getTechnicianBookingRequests(
  email: string,
  queryString = "",
): Promise<TechnicianBooking[]> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const suffix = queryString ? `?${queryString}` : "";
  const res = await fetch(
    `${BASE_URL}/get-booking-req/${encodeURIComponent(email)}${suffix}`,
    { cache: "no-store", headers: await getAuthHeaders() },
  );
  const data = (await res.json().catch(() => null)) as
    | GetTechnicianBookingRequestsResponse
    | TechnicianBookingApiDocument[]
    | null;

  if (!res.ok) {
    const message = data && !Array.isArray(data) ? data.message : undefined;
    throw new Error(
      message ?? `Couldn't load booking requests (${res.status}).`,
    );
  }

  const result = Array.isArray(data)
    ? data
    : Array.isArray(data?.result)
      ? data.result
      : data?.result?.bookings ?? data?.bookings;

  if (!result) {
    throw new Error("The booking requests API returned an unexpected response.");
  }

  const technicianEmail = email.trim().toLowerCase();

  return result
    .map(toTechnicianBooking)
    .filter(
      (booking) =>
        booking.technicianEmail.trim().toLowerCase() === technicianEmail,
    );
}
