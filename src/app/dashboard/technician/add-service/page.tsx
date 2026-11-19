import type { Metadata } from "next";
import { AddService } from "@/components/dashboard/technician/add-service";

export const metadata: Metadata = {
  title: "Add a Service",
};

export default function AddServicePage() {
  return <AddService />;
}
