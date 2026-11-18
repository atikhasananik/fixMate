import type { Metadata } from "next";
import { AdminServices } from "@/components/dashboard/admin-services";

export const metadata: Metadata = {
  title: "Service Approval",
};

export default function AdminServicesPage() {
  return <AdminServices />;
}
