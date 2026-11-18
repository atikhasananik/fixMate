import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Inbox,
  LayoutDashboard,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import type { DashboardNavConfig, DashboardNavItem } from "@/types/type";

export const DASHBOARD_NAV: DashboardNavConfig = {
  customer: [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: ClipboardList,
    },
    {
      label: "Payments",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: UserRound,
      exact: true,
    },
  ],
  technician: [
    {
      label: "Overview",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      label: "Requests",
      href: "/dashboard/technician/requests",
      icon: Inbox,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: UserRound,
      exact: true,
    },
  ],
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Services",
      href: "/dashboard/admin/services",
      icon: ShieldCheck,
    },
    {
      label: "Bookings",
      href: "/dashboard/admin/bookings",
      icon: CalendarDays,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: ReceiptText,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: UserRound,
      exact: true,
    },
  ],
};

export function isDashboardNavActive(
  pathname: string,
  item: DashboardNavItem
) {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
