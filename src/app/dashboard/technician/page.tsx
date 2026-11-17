import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Technician Dashboard",
};

export default function TechnicianDashboardPage() {
  return (
    <PagePlaceholder
      title="Technician Dashboard"
      description="Manage your service listings, respond to repair requests, and update job progress."
    />
  );
}
