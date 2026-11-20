"use client";

import Link from "next/link";
import { ClipboardList, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { ServiceThumbnail } from "@/components/dashboard/shared/service-thumbnail";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { formatCurrency, formatDate } from "@/lib/format";
import type { CustomerBooking } from "@/types/type";
import CustomerBookingsAction from "./customer-bookings-action";

type CustomerBookingsProps = {
  bookings: CustomerBooking[];
  error?: string | null;
};

export function CustomerBookings({ bookings, error }: CustomerBookingsProps) {
  async function handleStatusBtn(booking: CustomerBooking) {
    // const setCancelStatus = await setStatus

    toast.add({
      type: "info",
      title: "Cancellation isn't connected yet",
      description: `Your request for ${booking.serviceTitle} was not changed.`,
    });
  }

  function handlePay(booking: CustomerBooking) {
    // Stripe Checkout is not connected yet. Keep the entry point visible so
    // the flow can be wired without changing this table.
    toast.add({
      type: "info",
      title: "Secure checkout is not live yet",
      description: `Payment for ${booking.serviceTitle} will open here once Stripe is connected.`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Bookings"
        description="Every repair request you have sent, from requested to completed."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/services" />}
            variant="outline"
            className="h-9"
          >
            Browse services
          </Button>
        }
      />

      <TableCard
        title="All bookings"
        description="Your repair requests and their latest status."
      >
        {error ? (
          <div className="p-6">
            <Alert variant="destructive">
              <TriangleAlert aria-hidden="true" />
              <AlertTitle>Couldn&apos;t load your bookings</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No bookings yet"
            description="Browse approved services and send your first repair request."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden md:table-cell">
                  Technician
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  Preferred date
                </TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.map((booking) => {
                const amount =
                  (booking.finalAmount || 0) > booking.basePrice
                    ? booking.finalAmount
                    : booking.basePrice;

                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <ServiceThumbnail
                          title={booking.serviceTitle}
                          image={booking.serviceImage}
                        />
                        <div className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {booking.serviceTitle}
                          </span>
                          {booking.category ? (
                            <span className="block truncate text-xs text-muted-foreground">
                              {booking.category}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {booking.technicianName}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap sm:table-cell">
                      {formatDate(booking.preferredDate)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium tabular-nums">
                      {formatCurrency(amount?? 0)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge kind="booking" status={booking.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        kind="payment"
                        status={booking.paymentStatus}
                      />
                    </TableCell>
                    <CustomerBookingsAction
                      currentStatus={booking.status}
                      id={booking.id}
                      serviceTitle={booking.serviceTitle}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableCard>
    </div>
  );
}
