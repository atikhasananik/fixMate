import { BASE_URL } from "./post.data.api";

export const deleteService = async (id: string) => {
  const res = await fetch(`${BASE_URL}/delete-service/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Couldn't load your services (${res.status}).`);
  }

  const data = await res.json();

  return data;
};
