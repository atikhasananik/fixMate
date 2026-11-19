"use client";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { StatsGrid } from "@/components/dashboard/shared/stat-card";
import { useDashboardStore } from "@/components/dashboard/shared/dashboard-store";
import { getAdminStats } from "@/lib/dashboard-data";

export function AdminOverview() {
  const { users, services } = useDashboardStore();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor users, review technician services, and keep the platform running smoothly."
      />

      <StatsGrid stats={getAdminStats(users, services)} />
    </div>
  );
}
