import { BASE_URL } from "@/lib/Action/api/shared";
import type {
  AdminBooking,
  AdminBookingApiDocument,
  BookingStatus,
  GetAdminBookingsResponse,
  GetPaymentsResponse,
  GetServicesResponse,
  GetUsersResponse,
  PaymentApiDocument,
  PlatformUser,
  PlatformUserApiDocument,
  ServiceApiItem,
  UserRole,
} from "@/types/type";

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

/** Every service listing for the admin Service Approval page; the backend owns filtering. */
export async function getAdminServiceData(
  queryString = "",
): Promise<ServiceApiItem[]> {
  const suffix = queryString ? `?${queryString}` : "";
  const res = await fetch(
    `${BASE_URL}/get-all-services-by-admin${suffix}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error(`Couldn't load services (${res.status}).`);
  }

  const data = (await res.json()) as GetServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

function isBookingStatus(status: string): status is BookingStatus {
  return (
    status === "requested" ||
    status === "accepted" ||
    status === "in-progress" ||
    status === "completed" ||
    status === "rejected" ||
    status === "cancelled"
  );
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
