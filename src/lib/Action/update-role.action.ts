"use server";

import { updateUserRole } from "@/lib/Action/api/update.data.api";
import { requireDashboardRole } from "@/lib/dashboard-session";
import type { UpdateUserRoleResult, UserRole } from "@/types/type";

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
