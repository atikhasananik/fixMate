import { IServiceData } from "@/types/type";


export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API

export const postServive = async (payload:IServiceData ) => {
  console.log(payload);
}
