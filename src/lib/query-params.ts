/** Logical query key → URL parameter name. */
export type QueryParamMap = Record<string, string>;

export type QueryParamPatch = Record<string, string | null | undefined>;

function firstValue(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;

  return typeof raw === "string" ? raw : "";
}

/** Reads one mapped param from the route's raw search params. */
export function readParam(
  raw: Record<string, string | string[] | undefined>,
  key: string,
  params: QueryParamMap
): string {
  return firstValue(raw[params[key]]);
}

/**
 * Writes the patched params into a query string. Unrelated params are
 * preserved, and passing `null` removes a param.
 */
export function buildSearchParams(
  current: Record<string, string | string[] | undefined>,
  patch: QueryParamPatch,
  params: QueryParamMap
): string {
  const keys = Object.keys(params);
  const result = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    // Service/booking params are rewritten below from the patch.
    if (keys.some((paramKey) => params[paramKey] === key)) {
      continue;
    }

    const first = firstValue(value);

    if (first) {
      result.set(key, first);
    }
  }

  for (const key of keys) {
    const value = key in patch ? patch[key] : readParam(current, key, params);

    if (value) {
      result.set(params[key], value);
    }
  }

  return result.toString();
}

/** Only the mapped params, as a query string for the backend request. */
export function buildApiQuery(
  raw: Record<string, string | string[] | undefined>,
  params: QueryParamMap
): string {
  const result = new URLSearchParams();

  for (const key of Object.keys(params)) {
    const value = readParam(raw, key, params);

    if (value) {
      result.set(params[key], value);
    }
  }

  return result.toString();
}

/** True when any mapped param carries a value. */
export function hasActiveParams(
  raw: Record<string, string | string[] | undefined>,
  params: QueryParamMap
): boolean {
  return Object.keys(params).some((key) =>
    Boolean(readParam(raw, key, params))
  );
}
