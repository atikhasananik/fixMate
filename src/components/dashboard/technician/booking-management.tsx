"use client";

import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  MapPin,
  Phone,
} from "lucide-react";
import { BookingActions } from "@/components/dashboard/technician/booking-actions";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "@/components/ui/toast";
import { updateBookingStatus, updateBookingStatusByTechnician } from "@/lib/Action/api/update.data.api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { BookingStatus, TechnicianBooking } from "@/types/type";

type BookingFilter =
  | "all"
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed";

type BookingManagementProps = {
  bookings: TechnicianBooking[];
  error?: string | null;
};

const FILTER_OPTIONS: { value: BookingFilter; label: string }[] = [
  { value: "all", label: "All bookings" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

function displayValue(value: string) {
  return value.trim() || "Not provided";
}

function BookingDetails({ booking }: { booking: TechnicianBooking }) {
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Phone
        </dt>
        <dd className="mt-1 flex items-center gap-2 font-medium">
          <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {displayValue(booking.phone)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Preferred date
        </dt>
        <dd className="mt-1 flex items-center gap-2 font-medium">
          <CalendarDays
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          {booking.preferredDate
            ? formatDate(booking.preferredDate)
            : "Not provided"}
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Address
        </dt>
        <dd className="mt-1 flex items-start gap-2">
          <MapPin
            className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span>{displayValue(booking.address)}</span>
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Problem description
        </dt>
        <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-muted-foreground">
          {displayValue(booking.problemDescription)}
        </dd>
      </div>
    </dl>
  );
}

export function BookingManagement({
  bookings: initialBookings,
  error,
}: BookingManagementProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null,
  );

  const visibleBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  async function handleStatusChange(
    booking: TechnicianBooking,
    status: BookingStatus,
    finalAmount?: number,
  ): Promise<boolean> {
    if (updatingBookingId) {
      return false;
    }

    setUpdatingBookingId(booking.id);

    try {
      await updateBookingStatusByTechnician(booking.id, status, finalAmount);
      setBookings((currentBookings) =>
        currentBookings.map((currentBooking) =>
          currentBooking.id === booking.id
            ? {
                ...currentBooking,
                status,
                ...(finalAmount !== undefined ? { finalAmount } : {}),
              }
            : currentBooking,
        ),
      );
      toast.add({
        type: "success",
        title: "Booking updated",
        description: `${booking.serviceTitle} is now ${status.replace("-", " ")}.`,
      });
      return true;
    } catch (updateError) {
      toast.add({
        type: "error",
        title: "Couldn't update booking",
        description:
          updateError instanceof Error
            ? updateError.message
            : "Please try again in a moment.",
      });
      return false;
    } finally {
      setUpdatingBookingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Requests"
        description="Review customer repair requests and keep each booking moving."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Couldn&apos;t load booking requests</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <TableCard
          title="Repair bookings"
          description={`${bookings.length} ${bookings.length === 1 ? "request" : "requests"} assigned to you`}
          action={
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter((value ?? "all") as BookingFilter)
              }
            >
              <SelectTrigger
                className="w-full sm:w-44"
                aria-label="Filter bookings by status"
              >
                <SelectValue>
                  {FILTER_OPTIONS.find((option) => option.value === filter)
                    ?.label ?? "All bookings"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => (
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
              icon={ClipboardList}
              title={
                bookings.length === 0
                  ? "No repair requests yet"
                  : "No bookings match this filter"
              }
              description={
                bookings.length === 0
                  ? "New customer requests for your services will appear here."
                  : "Choose another status to see more repair requests."
              }
            />
          ) : (
            <>
              <div className="space-y-3 p-4 xl:hidden">
                {visibleBookings.map((booking) => (
                  <Card key={booking.id} className="gap-0">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="truncate">
                            {booking.serviceTitle}
                          </CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Customer: {booking.customerName}
                          </p>
                        </div>
                        <StatusBadge kind="booking" status={booking.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <BookingDetails booking={booking} />
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Starting price
                          </p>
                          <p className="font-semibold tabular-nums">
                            {formatCurrency(booking.basePrice)}
                          </p>
                          {booking.status === "completed" ? (
                            <div className="mt-1">
                              <StatusBadge
                                kind="payment"
                                status={booking.paymentStatus}
                              />
                            </div>
                          ) : null}
                        </div>
                        <BookingActions
                          booking={booking}
                          isUpdating={updatingBookingId === booking.id}
                          onStatusChange={(status, amount) =>
                            handleStatusChange(booking, status, amount)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="hidden xl:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Preferred date</TableHead>
                      <TableHead>Problem description</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.customerName}
                        </TableCell>
                        <TableCell>{displayValue(booking.phone)}</TableCell>
                        <TableCell className="max-w-56 whitespace-normal">
                          {displayValue(booking.address)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {booking.preferredDate
                            ? formatDate(booking.preferredDate)
                            : "Not provided"}
                        </TableCell>
                        <TableCell className="max-w-72 whitespace-normal">
                          <p className="line-clamp-3">
                            {displayValue(booking.problemDescription)}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-48 whitespace-normal font-medium">
                          {booking.serviceTitle}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge
                              kind="booking"
                              status={booking.status}
                            />
                            {booking.status === "completed" ? (
                              <StatusBadge
                                kind="payment"
                                status={booking.paymentStatus}
                              />
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <BookingActions
                            booking={booking}
                            isUpdating={updatingBookingId === booking.id}
                            onStatusChange={(status, amount) =>
                              handleStatusChange(booking, status, amount)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </TableCard>
      )}
    </div>
  );
}
