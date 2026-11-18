"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsGrid } from "@/components/dashboard/stat-card";
import { useDashboardStore } from "@/components/dashboard/dashboard-store";
import { getTechnicianStats } from "@/lib/dashboard-data";

export function TechnicianOverview() {
  const { services, bookings } = useDashboardStore();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Technician Dashboard"
        description="Manage your service listings and keep an eye on incoming repair requests."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/technician/add-service" />}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
          >
            Add service
          </Button>
        }
      />

      <StatsGrid stats={getTechnicianStats(services, bookings)} />
    </div>
  );
}
