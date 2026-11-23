"use server";

import { BASE_URL, getAuthHeaders } from "@/lib/Action/api/shared";

export const deleteService = async (id: string) => {
  const res = await fetch(`${BASE_URL}/delete-service/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Couldn't load your services (${res.status}).`);
  }

  const data = await res.json();

  return data;
};
