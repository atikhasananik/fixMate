import { BASE_URL } from "@/lib/Action/api/shared";
import { auth } from "@/lib/auth";
import type {
  GetFeaturedServicesResponse,
  GetServicesResponse,
  GetSingleServiceResponse,
  ServiceApiItem,
} from "@/types/type";
import { headers } from "next/headers";

/** Every service listing, used by the public services page. The backend owns searching/filtering/sorting. */
export async function getAllServiceData(
  queryString = "",
): Promise<ServiceApiItem[]> {
  const jwtToken = await auth.api.getToken({ headers: await headers() });
  const token = jwtToken.token;
  console.log(jwtToken.token);

  const suffix = queryString ? `?${queryString}` : "";
  const res = await fetch(`${BASE_URL}/get-all-services${suffix}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Couldn't load services (${res.status}).`);
  }

  const data = (await res.json()) as GetServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

// The six newest approved + available services for the homepage. The backend
// owns the filter, ordering and limit.
export async function getFeaturedServiceData(): Promise<ServiceApiItem[]> {
  const res = await fetch(`${BASE_URL}/get-featured-services`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Couldn't load featured services (${res.status}).`);
  }

  const data = (await res.json()) as GetFeaturedServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

// Fetches a single service listing by id; null when it does not exist.
export async function getSingleServiceData(
  id: string,
): Promise<ServiceApiItem | null> {
  const res = await fetch(`${BASE_URL}/get-single-service/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Couldn't load services (${res.status}).`);
  }

  const data = (await res.json()) as GetSingleServiceResponse;

  if (Array.isArray(data.result)) {
    return data.result.find((service) => service._id === id) ?? null;
  }

  return data.result ?? null;
}
