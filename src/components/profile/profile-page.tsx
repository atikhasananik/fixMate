"use client";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { ProfileOverview } from "@/components/profile/profile-overview";
import { UpdateProfileDialog } from "@/components/profile/update-profile-dialog";
import type { DashboardViewer } from "@/types/type";

type ProfilePageProps = {
  viewer: DashboardViewer;
};

export function ProfilePage({ viewer }: ProfilePageProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title="Profile"
        description="Manage the personal information connected to your FixMate account."
        action={<UpdateProfileDialog viewer={viewer} />}
      />
      <ProfileOverview viewer={viewer} />
    </div>
  );
}
