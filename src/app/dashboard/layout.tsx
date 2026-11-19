import { cookies } from "next/headers";
import { DashboardSidebar } from "@/components/dashboard/shared/dashboard-sidebar";
import { DashboardStoreProvider } from "@/components/dashboard/shared/dashboard-store";
import { DashboardTopbar } from "@/components/dashboard/shared/dashboard-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardSession, toDashboardViewer } from "@/lib/dashboard-session";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await getDashboardSession();
  const viewer = toDashboardViewer(session);

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <DashboardStoreProvider viewer={viewer}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar viewer={viewer} />
        <SidebarInset>
          <DashboardTopbar viewer={viewer} />
          <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardStoreProvider>
  );
}
