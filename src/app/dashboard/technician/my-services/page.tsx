import type { Metadata } from "next";
import { TechnicianServices } from "@/components/dashboard/technician/technician-services";

export const metadata: Metadata = {
  title: "My Services",
};

export default function TechnicianServicesPage() {
  return <TechnicianServices />;
}
