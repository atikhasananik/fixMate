import type { Metadata } from "next";
import { AdminBookings } from "@/components/dashboard/admin/admin-bookings";
import { getAdminBookingData } from "@/lib/Action/api/get.data.api";
import { buildAdminBookingsApiQuery } from "@/lib/admin-bookings-query";
import type { AdminBooking } from "@/types/type";

export const metadata: Metadata = {
  title: "All Bookings",
};

export default async function AdminBookingsPage({
  searchParams,
}: PageProps<"/dashboard/admin/bookings">) {
  const params = await searchParams;

  let bookings: AdminBooking[] = [];
  let error: string | null = null;

  try {
    // The backend owns filtering and sorting; the URL params are forwarded.
    bookings = await getAdminBookingData(buildAdminBookingsApiQuery(params));
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load bookings. Please try again.";
  }

  return (
    <AdminBookings bookings={bookings} error={error} searchParams={params} />
  );
}
