"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { useSignOut } from "@/hooks/use-sign-out";
import { DASHBOARD_NAV, isDashboardNavActive } from "@/lib/dashboard-nav";
import { ROLE_LABELS } from "@/lib/nav";
import type { DashboardTopbarProps, NavbarUser } from "@/types/type";

export function DashboardTopbar({ viewer }: DashboardTopbarProps) {
  const pathname = usePathname();
  const handleSignOut = useSignOut();

  const activeItem = DASHBOARD_NAV[viewer.role].find((item) =>
    isDashboardNavActive(pathname, item)
  );

  const user: NavbarUser = {
    name: viewer.name,
    email: viewer.email,
    image: viewer.image,
    role: viewer.role,
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4!" />

      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-medium text-foreground">
          {activeItem?.label ?? "Dashboard"}
        </span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          / {ROLE_LABELS[viewer.role]}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <UserMenu user={user} onSignOut={handleSignOut} />
      </div>
    </header>
  );
}
