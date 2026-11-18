import { requireDashboardRole } from "@/lib/dashboard-session";

export default async function CustomerDashboardLayout({
  children,
}: LayoutProps<"/dashboard/customer">) {
  await requireDashboardRole("customer");

  return children;
}
