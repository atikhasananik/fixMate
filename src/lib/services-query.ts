import {
  buildApiQuery,
  buildSearchParams,
  hasActiveParams,
  readParam,
} from "@/lib/query-params";

/** Logical query key → URL parameter name. */
export const SERVICE_PARAMS = {
  search: "search",
  category: "category",
  mode: "mode",
  availability: "availability",
  sort: "sort",
} as const;

export type ServiceQueryKey = keyof typeof SERVICE_PARAMS;

/** `null` removes the parameter from the URL. */
export type ServiceParamPatch = Partial<
  Record<ServiceQueryKey, string | null>
>;

/** Reads one service param from the route's raw search params. */
export function readServiceParam(
  raw: Record<string, string | string[] | undefined>,
  key: ServiceQueryKey
): string {
  return readParam(raw, key, SERVICE_PARAMS);
}

/**
 * Writes the patched service params into a query string. Unrelated params are
 * preserved, and passing `null` removes a service param.
 */
export function buildServicesSearchParams(
  current: Record<string, string | string[] | undefined>,
  patch: ServiceParamPatch
): string {
  return buildSearchParams(current, patch, SERVICE_PARAMS);
}

/** Only the service params, as a query string for the backend request. */
export function buildServiceApiQuery(
  raw: Record<string, string | string[] | undefined>
): string {
  return buildApiQuery(raw, SERVICE_PARAMS);
}

/** True when the URL carries any search, filter or sort value. */
export function hasActiveServiceFilters(
  raw: Record<string, string | string[] | undefined>
): boolean {
  return hasActiveParams(raw, SERVICE_PARAMS);
}
