import type { Metadata } from "next";
import { BookingManagement } from "@/components/dashboard/technician/booking-management";
import { getTechnicianBookingRequests } from "@/lib/Action/api/technician/get";
import { buildBookingsApiQuery } from "@/lib/bookings-query";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { TechnicianBooking } from "@/types/type";

export const metadata: Metadata = {
  title: "Manage Requests",
};

export default async function TechnicianRequestsPage({
  searchParams,
}: PageProps<"/dashboard/technician/requests">) {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user.email;
  const params = await searchParams;

  if (!email) {
    return (
      <BookingManagement
        bookings={[]}
        error="Your technician account could not be verified. Please sign in again."
        searchParams={params}
      />
    );
  }

  let bookings: TechnicianBooking[] = [];
  let errorMessage: string | null = null;

  try {
    // The backend owns filtering; the URL params are forwarded as-is.
    bookings = await getTechnicianBookingRequests(
      email,
      buildBookingsApiQuery(params),
    );
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Please try again in a moment.";
  }

  return (
    <BookingManagement
      bookings={bookings}
      error={errorMessage}
      searchParams={params}
    />
  );
}
