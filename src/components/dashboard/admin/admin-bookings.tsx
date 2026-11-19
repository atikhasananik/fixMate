"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
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
import type { BookingStatus } from "@/types/type";

type BookingFilter = BookingStatus | "all";

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
          <Select
            value={filter}
            onValueChange={(value) =>
              setFilter((value ?? "all") as BookingFilter)
            }
          >
            <SelectTrigger className="w-40" aria-label="Filter bookings by status">
              <SelectValue>
                {filter === "all"
                  ? "All statuses"
                  : BOOKING_STATUS_OPTIONS.find(
                      (option) => option.value === filter
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
        }
      >
        {visibleBookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No bookings match this filter"
            description="Choose another status to see more repair requests."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Technician
                </TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <ServiceThumbnail title={booking.serviceTitle} />
                      <span className="truncate font-medium text-foreground">
                        {booking.serviceTitle}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell">
                    {booking.customerName}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap lg:table-cell">
                    {booking.technicianName}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap sm:table-cell">
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
                    {formatCurrency(booking.finalAmount ?? booking.basePrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableCard>
    </div>
  );
}
