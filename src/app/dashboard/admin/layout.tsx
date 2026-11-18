import { requireDashboardRole } from "@/lib/dashboard-session";

export default async function AdminDashboardLayout({
  children,
}: LayoutProps<"/dashboard/admin">) {
  await requireDashboardRole("admin");

  return children;
}
