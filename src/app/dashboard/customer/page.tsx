import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CustomerOverview,
  CustomerOverviewSkeleton,
} from "@/components/dashboard/customer/customer-overview";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { getBookingData, getPaymentData } from "@/lib/Action/api/customer/get";
import { getDashboardSession } from "@/lib/dashboard-session";
import type { CustomerBooking, CustomerPayment } from "@/types/type";

export const metadata: Metadata = {
  title: "Customer Dashboard",
};

export default async function CustomerDashboardPage() {
  const session = await getDashboardSession();
  const firstName = session.user.name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's an overview of your account and recent activities."
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

      <Suspense fallback={<CustomerOverviewSkeleton />}>
        <CustomerOverviewSection email={session.user.email} />
      </Suspense>
    </div>
  );
}

async function CustomerOverviewSection({ email }: { email: string }) {
  // Both endpoints are scoped by the signed-in customer's email.
  let bookings: CustomerBooking[] = [];
  let payments: CustomerPayment[] = [];
  let errorMessage: string | null = null;

  try {
    [bookings, payments] = await Promise.all([
      getBookingData(email),
      getPaymentData(email),
    ]);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Couldn't load your dashboard. Please try again.";
  }

  return (
    <CustomerOverview
      bookings={bookings}
      payments={payments}
      error={errorMessage}
    />
  );
}
