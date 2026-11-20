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

const SERVICE_QUERY_KEYS = Object.keys(SERVICE_PARAMS) as ServiceQueryKey[];

function firstValue(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;

  return typeof raw === "string" ? raw : "";
}

/** Reads one service param from the route's raw search params. */
export function readServiceParam(
  raw: Record<string, string | string[] | undefined>,
  key: ServiceQueryKey
): string {
  return firstValue(raw[SERVICE_PARAMS[key]]);
}

/**
 * Writes the patched service params into a query string. Unrelated params are
 * preserved, and passing `null` removes a service param.
 */
export function buildServicesSearchParams(
  current: Record<string, string | string[] | undefined>,
  patch: ServiceParamPatch
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    if ((SERVICE_QUERY_KEYS as string[]).includes(key)) {
      continue;
    }

    const first = firstValue(value);

    if (first) {
      params.set(key, first);
    }
  }

  for (const key of SERVICE_QUERY_KEYS) {
    const value = key in patch ? patch[key] : readServiceParam(current, key);

    if (value) {
      params.set(SERVICE_PARAMS[key], value);
    }
  }

  return params.toString();
}
