import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <PagePlaceholder
      title="Admin Dashboard"
      description="Moderate service listings, manage user roles, and monitor bookings and revenue."
    />
  );
}
