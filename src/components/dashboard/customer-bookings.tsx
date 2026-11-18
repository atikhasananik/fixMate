"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceThumbnail } from "@/components/dashboard/service-thumbnail";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { TableCard } from "@/components/dashboard/table-card";
import { useDashboardStore } from "@/components/dashboard/dashboard-store";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Booking } from "@/types/type";

export function CustomerBookings() {
  const { bookings, cancelBooking } = useDashboardStore();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const pendingCancel = bookings.find((booking) => booking.id === cancelId);

  function handleCancel() {
    if (!pendingCancel) {
      return;
    }

    cancelBooking(pendingCancel.id);
    toast.add({
      type: "success",
      title: "Booking cancelled",
      description: `${pendingCancel.serviceTitle} has been cancelled.`,
    });
    setCancelId(null);
  }

  function handlePay(booking: Booking) {
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
        description="Cancel a request while it is still waiting for a technician."
      >
        {bookings.length === 0 ? (
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
                const canCancel = booking.status === "requested";
                const canPay =
                  booking.status === "completed" &&
                  booking.paymentStatus === "unpaid";
                const amount = booking.finalAmount ?? booking.basePrice;

                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <ServiceThumbnail title={booking.serviceTitle} />
                        <span className="truncate font-medium text-foreground">
                          {booking.serviceTitle}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {booking.technicianName}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap sm:table-cell">
                      {formatDate(booking.preferredDate)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium tabular-nums">
                      {formatCurrency(amount)}
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
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {canCancel ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCancelId(booking.id)}
                          >
                            Cancel
                          </Button>
                        ) : null}

                        {canPay ? (
                          <Button
                            size="sm"
                            onClick={() => handlePay(booking)}
                            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
                          >
                            Pay now
                          </Button>
                        ) : null}

                        {!canCancel && !canPay ? (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableCard>

      <AlertDialog
        open={pendingCancel !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setCancelId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingCancel
                ? `${pendingCancel.serviceTitle} will be cancelled and the technician will no longer see the request.`
                : "This request will be cancelled."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleCancel}>
              Cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
