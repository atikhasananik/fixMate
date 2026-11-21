"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { ServiceThumbnail } from "@/components/dashboard/shared/service-thumbnail";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { useDashboardStore } from "@/components/dashboard/shared/dashboard-store";
import { BOOKING_STATUS_OPTIONS } from "@/lib/dashboard-data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Booking, BookingStatus } from "@/types/type";

type BookingFilter = BookingStatus | "all";

type BookingServiceCellProps = {
  title: string;
  className?: string;
};

/** Thumbnail + title, shared by the desktop table and the mobile cards. */
function BookingServiceCell({ title, className }: BookingServiceCellProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <ServiceThumbnail title={title} />
      <span className="truncate font-medium text-foreground">{title}</span>
    </div>
  );
}

function getBookingAmount(booking: Booking) {
  return booking.finalAmount ?? booking.basePrice;
}

export function AdminBookings() {
  const { bookings } = useDashboardStore();
  const [filter, setFilter] = useState<BookingFilter>("all");

  const visibleBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="All Bookings"
        description="Every repair request on the platform, across all customers and technicians."
      />

      <TableCard
        title="Platform bookings"
        description="Read-only view. Technicians and customers manage their own status changes."
        action={
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter((value ?? "all") as BookingFilter)
              }
            >
              <SelectTrigger
                className="w-full sm:w-40"
                aria-label="Filter bookings by status"
              >
                <SelectValue>
                  {filter === "all"
                    ? "All statuses"
                    : BOOKING_STATUS_OPTIONS.find(
                        (option) => option.value === filter,
                      )?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {BOOKING_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {visibleBookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No bookings match this filter"
            description="Choose another status to see more repair requests."
          />
        ) : (
          <>
            {/* Mobile & tablet: stacked cards to avoid horizontal scrolling. */}
            <ul
              aria-label="Platform bookings"
              className="divide-y divide-border/60 xl:hidden"
            >
              {visibleBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <BookingServiceCell
                      title={booking.serviceTitle}
                      className="flex-1"
                    />
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge kind="booking" status={booking.status} />
                      <StatusBadge
                        kind="payment"
                        status={booking.paymentStatus}
                      />
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/60 pt-3 text-sm">
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">
                        Customer
                      </dt>
                      <dd className="truncate font-medium text-foreground">
                        {booking.customerName}
                      </dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">
                        Technician
                      </dt>
                      <dd className="truncate font-medium text-foreground">
                        {booking.technicianName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Preferred date
                      </dt>
                      <dd className="font-medium text-foreground">
                        {formatDate(booking.preferredDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Amount</dt>
                      <dd className="font-medium tabular-nums text-foreground">
                        {formatCurrency(getBookingAmount(booking))}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            {/* Desktop: the existing table, unchanged in structure. */}
            <div className="hidden xl:block">
              <Table className="[&_td]:py-3">
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {visibleBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <BookingServiceCell title={booking.serviceTitle} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {booking.customerName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {booking.technicianName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(booking.preferredDate)}
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
                      <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                        {formatCurrency(getBookingAmount(booking))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </TableCard>
    </div>
  );
}
