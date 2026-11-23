import { BASE_URL } from "@/lib/Action/api/shared";
import type {
  BookingApiDocument,
  BookingStatus,
  CustomerBooking,
  CustomerPayment,
  GetBookingByIdResponse,
  GetBookingsResponse,
  GetPaymentsResponse,
  PaymentApiDocument,
  PaymentRecordStatus,
} from "@/types/type";

const BOOKING_STATUSES: BookingStatus[] = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

export const toPaymentRecordStatus = (status?: string): PaymentRecordStatus => {
  if (
    status === "paid" ||
    status === "unpaid" ||
    status === "no_payment_required"
  ) {
    return status;
  }

  return "unknown";
};

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
    const message = data && !Array.isArray(data) ? data.message : undefined;
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

export async function getBookingById(
  id: string,
): Promise<CustomerBooking | null> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const res = await fetch(
    `${BASE_URL}/get-booking-by-id/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  const data = (await res.json().catch(() => null)) as
    | GetBookingByIdResponse
    | null;

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    const message = data?.message;
    throw new Error(message ?? `Couldn't load booking (${res.status}).`);
  }

  const result = data?.result;

  if (!result) {
    return null;
  }

  try {
    return toCustomerBooking(result);
  } catch {
    return null;
  }
}

function toCustomerPayment(item: PaymentApiDocument): CustomerPayment {
  const id = item._id;

  if (!id) {
    throw new Error("The payments response contains an invalid payment.");
  }

  const amount = Number(item.amount);

  return {
    id,
    bookingId: item.bookingId ?? "",
    serviceTitle: item.serviceTitle?.trim() || undefined,
    technicianName: item.technicianName?.trim() || undefined,
    amount: Number.isFinite(amount) ? amount : 0,
    currency: item.currency?.trim() || "usd",
    status: toPaymentRecordStatus(item.paymentStatus),
    paidAt: item.paidAt || undefined,
    transactionId: item.transactionId?.trim() || undefined,
  };
}

// Fetches the payment history of one customer. The caller passes the email
// from the signed-in session, so only that customer's payments are loaded.
export async function getPaymentData(
  email: string,
): Promise<CustomerPayment[]> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const res = await fetch(
    `${BASE_URL}/get-payment/${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );
  const data = (await res.json().catch(() => null)) as
    | GetPaymentsResponse
    | PaymentApiDocument[]
    | null;

  if (!res.ok) {
    const message = data && !Array.isArray(data) ? data.message : undefined;
    throw new Error(message ?? `Couldn't load your payments (${res.status}).`);
  }

  const result = Array.isArray(data) ? data : data?.result;

  if (!Array.isArray(result)) {
    throw new Error("The payments API returned an unexpected response.");
  }

  // The API returns payments in insertion order; show the latest first.
  return result
    .map(toCustomerPayment)
    .sort((a, b) => (b.paidAt ?? "").localeCompare(a.paidAt ?? ""));
}
