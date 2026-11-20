import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile/profile-page";
import {
  getDashboardSession,
  toDashboardViewer,
} from "@/lib/dashboard-session";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function DashboardProfilePage() {
  const session = await getDashboardSession();
  const viewer = toDashboardViewer(session);

  return <ProfilePage viewer={viewer} />;
}
