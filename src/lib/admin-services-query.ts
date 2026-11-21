import {
  buildApiQuery,
  buildSearchParams,
  readParam,
} from "@/lib/query-params";

/** Logical query key → URL parameter name. */
export const ADMIN_SERVICE_PARAMS = {
  approvalStatus: "approvalStatus",
} as const;

export type AdminServiceQueryKey = keyof typeof ADMIN_SERVICE_PARAMS;

/** `null` removes the parameter from the URL. */
export type AdminServiceParamPatch = Partial<
  Record<AdminServiceQueryKey, string | null>
>;

/** Reads one admin service param from the route's raw search params. */
export function readAdminServiceParam(
  raw: Record<string, string | string[] | undefined>,
  key: AdminServiceQueryKey
): string {
  return readParam(raw, key, ADMIN_SERVICE_PARAMS);
}

/**
 * Writes the patched admin service params into a query string. Unrelated
 * params are preserved, and passing `null` removes an admin filter.
 */
export function buildAdminServicesSearchParams(
  current: Record<string, string | string[] | undefined>,
  patch: AdminServiceParamPatch
): string {
  return buildSearchParams(current, patch, ADMIN_SERVICE_PARAMS);
}

/** Only the admin service params, as a query string for the backend request. */
export function buildAdminServicesApiQuery(
  raw: Record<string, string | string[] | undefined>
): string {
  return buildApiQuery(raw, ADMIN_SERVICE_PARAMS);
}
