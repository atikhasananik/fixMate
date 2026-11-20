import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRoleDashboardPath, normalizeUserRole } from "@/lib/nav";
import type { DashboardViewer, UserRole } from "@/types/type";

type DashboardSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

/**
 * Server-side guard for every dashboard route. The proxy already checks for a
 * session cookie, but pages still validate it before rendering private data.
 */
export async function getDashboardSession(): Promise<DashboardSession> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?redirect=/dashboard");
  }

  return session;
}

/** Sends a signed-in user to their own dashboard when they open another role's. */
export async function requireDashboardRole(
  role: UserRole
): Promise<DashboardSession> {
  const session = await getDashboardSession();
  const viewerRole = normalizeUserRole(session.user.role);

  if (viewerRole !== role) {
    redirect(getRoleDashboardPath(viewerRole));
  }

  return session;
}

export function toDashboardViewer(
  session: DashboardSession
): DashboardViewer {
  const joinedAt =
    session.user.createdAt instanceof Date
      ? session.user.createdAt
      : new Date(session.user.createdAt);

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    role: normalizeUserRole(session.user.role),
    phone: session.user.phone ?? null,
    area: session.user.area ?? null,
    bio: session.user.bio ?? null,
    joinedAt: joinedAt.toISOString(),
  };
}
