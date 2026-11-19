import { IServiceData } from "@/types/type";

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API;

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
