import { BASE_URL } from "./post.data.api";
import type {
  AdminBooking,
  AdminBookingApiDocument,
  BookingApiDocument,
  BookingStatus,
  CreatePaymentIntentResponse,
  CustomerBooking,
  CustomerPayment,
  GetAdminBookingsResponse,
  GetBookingByIdResponse,
  GetBookingsResponse,
  GetFeaturedServicesResponse,
  GetPaymentsResponse,
  GetServicesResponse,
  GetSingleServiceResponse,
  GetUsersResponse,
  PaymentApiDocument,
  PaymentRecordStatus,
  PlatformUser,
  PlatformUserApiDocument,
  ServiceApiItem,
  GetTechnicianBookingRequestsResponse,
  TechnicianBooking,
  TechnicianBookingApiDocument,
  UserRole,
} from "@/types/type";

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

// Every service listing, used by the public services page. The backend does
// the searching, filtering and sorting; pass the URL query string through.
export async function getAllServiceData(
  queryString = "",
): Promise<ServiceApiItem[]> {
  const suffix = queryString ? `?${queryString}` : "";
  const res = await fetch(`${BASE_URL}/get-all-services${suffix}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Couldn't load services (${res.status}).`);
  }

  const data = (await res.json()) as GetServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

// The six newest approved + available services for the homepage. The backend
// owns the filter, ordering and limit.
export async function getFeaturedServiceData(): Promise<ServiceApiItem[]> {
  const res = await fetch(`${BASE_URL}/get-featured-services`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Couldn't load featured services (${res.status}).`);
  }

  const data = (await res.json()) as GetFeaturedServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

// Admin service approval listing. The backend owns filtering and the
// pending-first ordering; the URL query string is passed through untouched.
export async function getAdminServiceData(
  queryString = "",
): Promise<ServiceApiItem[]> {
  const suffix = queryString ? `?${queryString}` : "";
  const res = await fetch(`${BASE_URL}/get-all-services-by-admin${suffix}`, {
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

  const data = (await res.json()) as GetSingleServiceResponse;

  if (Array.isArray(data.result)) {
    return data.result.find((service) => service._id === id) ?? null;
  }

  return data.result ?? null;
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

// Fetches a single booking by id for the checkout flow. Returns null when the
// booking does not exist so callers can render a not-found state.
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

// Creates a Stripe Checkout session for a booking so the customer can pay.
export async function createPaymentIntent(
  payload: { bookingId: string },
): Promise<CreatePaymentIntentResponse> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  console.log(payload);
  const res = await fetch(`${BASE_URL}/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => null)) as
    | CreatePaymentIntentResponse
    | null;

  if (!res.ok) {
    const message = data?.message;
    throw new Error(message ?? `Couldn't create the payment (${res.status}).`);
  }

  if (!data || typeof data.success !== "boolean") {
    throw new Error("The payment API returned an unexpected response.");
  }

  return data;
}

export const toPaymentRecordStatus = (status?: string): PaymentRecordStatus => {
  if (status === "paid" || status === "unpaid" || status === "no_payment_required") {
    return status;
  }

  return "unknown";
};

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

/**
 * Fetches the payment history of one customer. The caller passes the email
 * from the signed-in session, so only that customer's payments are loaded.
 */
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

/**
 * Fetches every payment record on the platform, newest first. The admin
 * transactions overview uses this; the backend owns the query.
 */
export async function getAllPayments(): Promise<PaymentApiDocument[]> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const res = await fetch(`${BASE_URL}/get-payments`, { cache: "no-store" });
  const data = (await res.json().catch(() => null)) as
    | GetPaymentsResponse
    | PaymentApiDocument[]
    | null;

  if (!res.ok) {
    const message = data && !Array.isArray(data) ? data.message : undefined;
    throw new Error(message ?? `Couldn't load payments (${res.status}).`);
  }

  const result = Array.isArray(data) ? data : data?.result;

  if (!Array.isArray(result)) {
    throw new Error("The payments API returned an unexpected response.");
  }

  // The API returns payments in insertion order; show the latest first.
  return [...result].sort(
    (a, b) => (b.paidAt ?? "").localeCompare(a.paidAt ?? ""),
  );
}

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
    { cache: "no-store" },
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

function toPlatformUser(item: PlatformUserApiDocument): PlatformUser {
  if (!item._id) {
    throw new Error("The users response contains an invalid user.");
  }

  const role: UserRole =
    item.role === "admin" || item.role === "technician"
      ? item.role
      : "customer";

  return {
    id: item._id,
    name: item.name?.trim() || "Unnamed user",
    email: item.email?.trim() || "No email",
    image: item.image || undefined,
    role,
    joinedAt: item.createdAt ?? "",
  };
}

/** Fetches every registered account for the admin Manage Users page. */
export async function getAllUsers(): Promise<PlatformUser[]> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const res = await fetch(`${BASE_URL}/get-all-users`, { cache: "no-store" });
  const data = (await res.json().catch(() => null)) as GetUsersResponse | null;

  if (!res.ok) {
    throw new Error(data?.message ?? `Couldn't load users (${res.status}).`);
  }

  if (!Array.isArray(data?.result)) {
    throw new Error("The users API returned an unexpected response.");
  }

  return data.result.map(toPlatformUser);
}

function toAdminBooking(item: AdminBookingApiDocument): AdminBooking {
  const id = item._id ?? item.id;

  if (!id) {
    throw new Error("The bookings response contains an invalid booking.");
  }

  const basePrice = Number(item.basePrice);
  const finalAmount =
    item.finalAmount == null ? undefined : Number(item.finalAmount);

  return {
    id,
    serviceTitle: item.serviceTitle || "Repair service",
    serviceImage: item.serviceImage || undefined,
    customerName: item.customerName || "Unknown customer",
    technicianName: item.technicianName || "Not assigned",
    preferredDate: item.preferredDate || "",
    basePrice: Number.isFinite(basePrice) ? basePrice : 0,
    ...(finalAmount !== undefined && Number.isFinite(finalAmount)
      ? { finalAmount }
      : {}),
    status:
      item.status && isBookingStatus(item.status) ? item.status : "requested",
    paymentStatus:
      item.paymentStatus === "paid" || item.paymentStatus === "unpaid"
        ? item.paymentStatus
        : "unpaid",
  };
}

/** Fetches every booking for the admin All Bookings page. */
export async function getAdminBookingData(
  queryString = "",
): Promise<AdminBooking[]> {
  if (!BASE_URL) {
    throw new Error("The service API is not configured.");
  }

  const suffix = queryString ? `?${queryString}` : "";
  const res = await fetch(`${BASE_URL}/get-bookings-by-admin${suffix}`, {
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as
    | GetAdminBookingsResponse
    | null;

  if (!res.ok) {
    throw new Error(data?.message ?? `Couldn't load bookings (${res.status}).`);
  }

  if (!Array.isArray(data?.result)) {
    throw new Error("The bookings API returned an unexpected response.");
  }

  return data.result.map(toAdminBooking);
}
