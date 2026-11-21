import {
  buildApiQuery,
  buildSearchParams,
  readParam,
} from "@/lib/query-params";

/** Logical query key → URL parameter name. */
export const ADMIN_BOOKING_PARAMS = {
  status: "status",
  search: "search",
  sort: "sort",
} as const;

export type AdminBookingQueryKey = keyof typeof ADMIN_BOOKING_PARAMS;

/** `null` removes the parameter from the URL. */
export type AdminBookingParamPatch = Partial<
  Record<AdminBookingQueryKey, string | null>
>;

/** Reads one admin booking param from the route's raw search params. */
export function readAdminBookingParam(
  raw: Record<string, string | string[] | undefined>,
  key: AdminBookingQueryKey
): string {
  return readParam(raw, key, ADMIN_BOOKING_PARAMS);
}

/**
 * Writes the patched admin booking params into a query string. Unrelated
 * params are preserved, and passing `null` removes an admin filter.
 */
export function buildAdminBookingsSearchParams(
  current: Record<string, string | string[] | undefined>,
  patch: AdminBookingParamPatch
): string {
  return buildSearchParams(current, patch, ADMIN_BOOKING_PARAMS);
}

/** Only the admin booking params, as a query string for the backend request. */
export function buildAdminBookingsApiQuery(
  raw: Record<string, string | string[] | undefined>
): string {
  return buildApiQuery(raw, ADMIN_BOOKING_PARAMS);
}
