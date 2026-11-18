import type { Metadata } from "next";
import { TechnicianOverview } from "@/components/dashboard/technician-overview";

export const metadata: Metadata = {
  title: "Technician Dashboard",
};

export default function TechnicianDashboardPage() {
  return <TechnicianOverview />;
}
