import type { Metadata } from "next";
import { AdminBookings } from "@/components/dashboard/admin/admin-bookings";

export const metadata: Metadata = {
  title: "All Bookings",
};

export default async function AdminBookingsPage() {
  return <AdminBookings />;
}
