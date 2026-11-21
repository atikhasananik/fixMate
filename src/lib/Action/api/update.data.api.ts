import { BASE_URL } from "./post.data.api";
import type { ServiceFields } from "@/lib/service-payload";
import type {
  BookingStatus,
  ServiceApprovalStatus,
  UpdateBookingStatusResponse,
  UpdateServiceApprovalStatusResponse,
  UpdateServiceAvailabilityResponse,
  UpdateUserRoleResponse,
  UserRole,
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

export const updateServiceAvailability = async (
  id: string,
  isAvailable: boolean,
): Promise<UpdateServiceAvailabilityResponse> => {
  const res = await fetch(`${BASE_URL}/update-service-isavailable/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
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

export const updateServiceApprovalStatus = async (
  id: string,
  approvalStatus: ServiceApprovalStatus,
): Promise<UpdateServiceApprovalStatusResponse> => {
  const res = await fetch(`${BASE_URL}/update-service/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ approvalStatus }),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update the service (${res.status}).`);
  }

  const data = (await res.json()) as UpdateServiceApprovalStatusResponse;

  if (data.success === false) {
    throw new Error(
      data.result?.message ?? data.message ?? "Couldn't update the service.",
    );
  }

  if (data.result?.matchedCount === 0) {
    throw new Error("That service could not be found.");
  }

  return data;
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

/**
 * Changes a user's role through the admin-only backend route.
 *
 * Must only be called from the server (see `update-role.action.ts`): the admin
 * key is a server-only env var, so it never reaches the browser.
 */
export const updateUserRole = async (
  email: string,
  role: UserRole,
): Promise<UpdateUserRoleResponse> => {
  const res = await fetch(`${BASE_URL}/update-role-by-admin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-api-key": process.env.ADMIN_API_KEY ?? "",
    },
    body: JSON.stringify({ email, role }),
  });

  const data = (await res.json().catch(() => null)) as
    | UpdateUserRoleResponse
    | null;

  if (!res.ok || data?.success === false) {
    throw new Error(
      data?.message ?? `Couldn't update the role (${res.status}).`,
    );
  }

  return data ?? {};
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
