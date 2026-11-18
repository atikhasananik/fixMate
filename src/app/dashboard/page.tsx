import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRoleDashboardPath } from "@/lib/nav";

/**
 * Role-aware entry point for `/dashboard`. Used as the OAuth callback so
 * social sign-in can land on the correct dashboard without knowing the role
 * on the client beforehand.
 */
export default async function DashboardIndexPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?redirect=/dashboard");
  }

  redirect(getRoleDashboardPath(session.user.role));
}
