import {
  buildApiQuery,
  buildSearchParams,
  hasActiveParams,
  readParam,
} from "@/lib/query-params";

/** Logical query key → URL parameter name. */
export const BOOKING_PARAMS = {
  status: "status",
} as const;

export type BookingQueryKey = keyof typeof BOOKING_PARAMS;

/** `null` removes the parameter from the URL. */
export type BookingParamPatch = Partial<
  Record<BookingQueryKey, string | null>
>;

/** Reads one booking param from the route's raw search params. */
export function readBookingParam(
  raw: Record<string, string | string[] | undefined>,
  key: BookingQueryKey
): string {
  return readParam(raw, key, BOOKING_PARAMS);
}

/**
 * Writes the patched booking params into a query string. Unrelated params are
 * preserved, and passing `null` removes a booking param.
 */
export function buildBookingsSearchParams(
  current: Record<string, string | string[] | undefined>,
  patch: BookingParamPatch
): string {
  return buildSearchParams(current, patch, BOOKING_PARAMS);
}

/** Only the booking params, as a query string for the backend request. */
export function buildBookingsApiQuery(
  raw: Record<string, string | string[] | undefined>
): string {
  return buildApiQuery(raw, BOOKING_PARAMS);
}

/** True when the URL carries any booking filter value. */
export function hasActiveBookingFilters(
  raw: Record<string, string | string[] | undefined>
): boolean {
  return hasActiveParams(raw, BOOKING_PARAMS);
}
