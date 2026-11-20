import { BASE_URL } from "./post.data.api";
import type { ServiceApiItem } from "@/types/type";

type GetServicesResponse = {
  status?: number;
  message?: string;
  result?: ServiceApiItem[];
};

/** Fetches the services that belong to one technician from the Express API. */
export async function getServiceData(
  technicianEmail: string,
): Promise<ServiceApiItem[]> {
  const res = await fetch(
    `${BASE_URL}/get-services/${encodeURIComponent(technicianEmail)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error(`Couldn't load your services (${res.status}).`);
  }

  const data = (await res.json()) as GetServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

// Every service listing, used by the public services page.
export async function getAllServiceData(): Promise<ServiceApiItem[]> {
  const res = await fetch(`${BASE_URL}/get-all-services`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Couldn't load services (${res.status}).`);
  }

  const data = (await res.json()) as GetServicesResponse;

  return Array.isArray(data.result) ? data.result : [];
}

// get single service data

export const getSingleServiceData = async (
  id: string,
): Promise<ServiceApiItem | null> => {
  const res = await fetch(`${BASE_URL}/get-single-service/${id}`);

  if (!res.ok) {
    throw new Error(`Couldn't load services (${res.status}).`);
  }

  const data = (await res.json()) as {
    status?: number;
    message?: string;
    result?: ServiceApiItem | ServiceApiItem[];
  };

  if (Array.isArray(data.result)) {
    return data.result.find((service) => service._id === id) ?? null;
  }

  return data.result ?? null;
};
