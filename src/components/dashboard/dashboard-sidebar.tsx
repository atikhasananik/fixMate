"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAV, isDashboardNavActive } from "@/lib/dashboard-nav";
import { ROLE_BADGE_CLASSES, ROLE_LABELS, getInitials } from "@/lib/nav";
import type { DashboardSidebarProps } from "@/types/type";

export function DashboardSidebar({ viewer }: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = DASHBOARD_NAV[viewer.role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link
          href="/"
          className="flex h-10 items-center gap-2.5 rounded-lg px-1 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Wrench className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate font-heading text-sm font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            FixMate
          </span>
        </Link>

        <div className="flex items-center gap-2 px-1 group-data-[collapsible=icon]:hidden">
          <Badge
            variant="outline"
            className={cn("h-5", ROLE_BADGE_CLASSES[viewer.role])}
          >
            {ROLE_LABELS[viewer.role]}
          </Badge>
          <span className="truncate text-xs text-muted-foreground">
            Dashboard
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isDashboardNavActive(pathname, item);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                      className="data-active:bg-blue-50! data-active:text-blue-700! data-active:hover:bg-blue-50! data-active:hover:text-blue-700! dark:data-active:bg-blue-950/60! dark:data-active:text-blue-300! dark:data-active:hover:bg-blue-950/60!"
                    >
                      <Icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard/profile" />}
              size="lg"
              tooltip="Your profile"
              className="h-auto py-1.5"
            >
              <Avatar size="sm">
                {viewer.image ? (
                  <AvatarImage
                    src={viewer.image}
                    alt={`${viewer.name}'s avatar`}
                  />
                ) : null}
                <AvatarFallback>{getInitials(viewer.name)}</AvatarFallback>
              </Avatar>
              <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">
                  {viewer.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {viewer.email}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
