import type { NavbarUser, UserRole } from "@/types/type";

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
] as const;

/**
 * Temporary demo session until BetterAuth is wired up.
 * Set this to `null` to preview the signed-out navbar, or replace the
 * navbar state with the real session hook later.
 */
export const DEMO_USER: NavbarUser = {
  name: "Ayesha Rahman",
  email: "ayesha.rahman@example.com",
  image: "/avatar-demo.svg",
  role: "customer",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  customer:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300",
  technician:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/60 dark:text-indigo-300",
  admin:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300",
};

export const DASHBOARD_PATHS: Record<UserRole, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

export function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Dashboard for a session role, falling back to the customer dashboard. */
export function getRoleDashboardPath(role: string | null | undefined) {
  if (role === "technician") {
    return DASHBOARD_PATHS.technician;
  }

  if (role === "admin") {
    return DASHBOARD_PATHS.admin;
  }

  return DASHBOARD_PATHS.customer;
}

/**
 * Accepts only internal paths, so `?redirect=` cannot be used for an open
 * redirect, and never sends users back to the auth pages.
 */
export function sanitizeRedirectPath(
  value: string | string[] | undefined
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }

  if (value === "/sign-in" || value.startsWith("/sign-in?") || value.startsWith("/sign-in/")) {
    return undefined;
  }

  return value;
}
