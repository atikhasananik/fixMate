"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { StatsGrid } from "@/components/dashboard/shared/stat-card";
import { useDashboardStore } from "@/components/dashboard/shared/dashboard-store";
import { getCustomerStats } from "@/lib/dashboard-data";

export function CustomerOverview() {
  const { bookings } = useDashboardStore();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customer Dashboard"
        description="Track your repair requests, follow active jobs, and review completed work."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/services" />}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
          >
            Browse services
          </Button>
        }
      />

      <StatsGrid stats={getCustomerStats(bookings)} />
    </div>
  );
}
