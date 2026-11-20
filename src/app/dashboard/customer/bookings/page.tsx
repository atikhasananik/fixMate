import type { Metadata } from "next";
import { CustomerBookings } from "@/components/dashboard/customer/customer-bookings";
import { getDashboardSession } from "@/lib/dashboard-session";
import { getBookingData } from "@/lib/Action/api/get.data.api";

export const metadata: Metadata = {
  title: "My Bookings",
};

export default async function CustomerBookingsPage() {
  const session = await getDashboardSession();
  let bookings: Awaited<ReturnType<typeof getBookingData>> = [];
  let error: string | null = null;

  try {
    bookings = await getBookingData(session.user.email);
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load your bookings. Please try again.";
  }

  return <CustomerBookings bookings={bookings} error={error} />;
}
