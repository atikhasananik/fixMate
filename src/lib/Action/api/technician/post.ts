import { BASE_URL } from "@/lib/Action/api/shared";
import type { IServiceData } from "@/types/type";

export const postServive = async (payload: IServiceData) => {
  const res = await fetch(`${BASE_URL}/add-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  console.log(data);
  return data;
};
