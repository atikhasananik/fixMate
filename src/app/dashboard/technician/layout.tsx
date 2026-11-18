import { requireDashboardRole } from "@/lib/dashboard-session";

export default async function TechnicianDashboardLayout({
  children,
}: LayoutProps<"/dashboard/technician">) {
  await requireDashboardRole("technician");

  return children;
}
