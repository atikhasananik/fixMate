import type { Metadata } from "next";
import { BookingManagement } from "@/components/dashboard/technician/booking-management";
import { getTechnicianBookingRequests } from "@/lib/Action/api/get.data.api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { TechnicianBooking } from "@/types/type";

export const metadata: Metadata = {
  title: "Manage Requests",
};

export default async function TechnicianRequestsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user.email;

  if (!email) {
    return (
      <BookingManagement
        bookings={[]}
        error="Your technician account could not be verified. Please sign in again."
      />
    );
  }

  let bookings: TechnicianBooking[] = [];
  let errorMessage: string | null = null;

  try {
    bookings = await getTechnicianBookingRequests(email);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Please try again in a moment.";
  }

  return <BookingManagement bookings={bookings} error={errorMessage} />;
}
