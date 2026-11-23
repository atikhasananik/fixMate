"use server";

import { BASE_URL, getAuthHeaders } from "@/lib/Action/api/shared";
import { requireDashboardRole } from "@/lib/dashboard-session";
import type {
  ServiceApprovalStatus,
  UpdateServiceApprovalStatusResponse,
  UpdateUserRoleResponse,
  UpdateUserRoleResult,
  UserRole,
} from "@/types/type";

export async function updateServiceApprovalStatus(
  id: string,
  approvalStatus: ServiceApprovalStatus,
): Promise<UpdateServiceApprovalStatusResponse> {
  const res = await fetch(`${BASE_URL}/update-service/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify({ approvalStatus }),
  });

  if (!res.ok) {
    throw new Error(`Couldn't update the service (${res.status}).`);
  }

  const data = (await res.json()) as UpdateServiceApprovalStatusResponse;

  if (data.success === false) {
    throw new Error(
      data.result?.message ?? data.message ?? `Couldn't update the service.`,
    );
  }

  if (data.result?.matchedCount === 0) {
    throw new Error("That service could not be found.");
  }

  return data;
}

export async function updateUserRole(
  email: string,
  role: UserRole,
): Promise<UpdateUserRoleResponse> {
  const res = await fetch(`${BASE_URL}/update-role-by-admin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
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
}

/**
 * Admin-only gate for role changes. The Express route also requires a
 * server-only key, so this action is the only path the browser can use.
 */
export async function updateUserRoleAction(
  email: string,
  role: UserRole,
): Promise<UpdateUserRoleResult> {
  await requireDashboardRole("admin");

  try {
    await updateUserRole(email, role);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Please try again in a moment.",
    };
  }
}
