import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

/**
 * Bearer headers for authenticated API calls, built from the Better Auth
 * session cookie via `auth.api.getToken()`. Returns no Authorization header
 * when there is no session, so the backend responds with its normal 401 and
 * the caller's existing error handling kicks in.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const jwtToken = await auth.api.getToken({ headers: await headers() });
    const token = jwtToken?.token;

    return token ? { authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}
