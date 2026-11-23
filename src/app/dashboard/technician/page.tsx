import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  TechnicianOverview,
  TechnicianOverviewSkeleton,
} from "@/components/dashboard/technician/technician-overview";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { getTechnicianBookingRequests } from "@/lib/Action/api/get.data.api";
import { getDashboardSession } from "@/lib/dashboard-session";
import type { TechnicianBooking } from "@/types/type";

export const metadata: Metadata = {
  title: "Technician Dashboard",
};

export default async function TechnicianDashboardPage() {
  const session = await getDashboardSession();
  const firstName = session.user.name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Manage your service requests, track your jobs, and keep your work organized."
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

      <Suspense fallback={<TechnicianOverviewSkeleton />}>
        <TechnicianOverviewSection email={session.user.email} />
      </Suspense>
    </div>
  );
}

async function TechnicianOverviewSection({ email }: { email: string }) {
  // The endpoint returns the requests assigned to this technician only.
  let bookings: TechnicianBooking[] = [];
  let errorMessage: string | null = null;

  try {
    bookings = await getTechnicianBookingRequests(email);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Couldn't load your dashboard. Please try again.";
  }

  return <TechnicianOverview bookings={bookings} error={errorMessage} />;
}
