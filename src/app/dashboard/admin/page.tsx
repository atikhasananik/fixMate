import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AdminOverview,
  AdminOverviewSkeleton,
} from "@/components/dashboard/admin/admin-overview";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import {
  getAdminBookingData,
  getAdminServiceData,
  getAllPayments,
  getAllUsers,
} from "@/lib/Action/api/get.data.api";
import { getDashboardSession } from "@/lib/dashboard-session";
import type {
  AdminBooking,
  PaymentApiDocument,
  PlatformUser,
  ServiceApiItem,
} from "@/types/type";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const session = await getDashboardSession();
  const firstName = session.user.name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's an overview of your platform's performance and activities."
      />

      <Suspense fallback={<AdminOverviewSkeleton />}>
        <AdminOverviewSection />
      </Suspense>
    </div>
  );
}

async function AdminOverviewSection() {
  let users: PlatformUser[] = [];
  let services: ServiceApiItem[] = [];
  let bookings: AdminBooking[] = [];
  let payments: PaymentApiDocument[] = [];
  let error: string | null = null;

  try {
    // All of these endpoints are scoped to the whole platform; the admin
    // layout already guarantees the caller is an authenticated admin.
    const [usersResult, servicesResult, bookingsResult, paymentsResult] =
      await Promise.all([
        getAllUsers(),
        getAdminServiceData(""),
        getAdminBookingData(""),
        getAllPayments(),
      ]);

    users = usersResult;
    services = servicesResult;
    bookings = bookingsResult;
    payments = paymentsResult;
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load your dashboard. Please try again.";
  }

  return (
    <AdminOverview
      users={users}
      services={services}
      bookings={bookings}
      payments={payments}
      error={error}
    />
  );
}
