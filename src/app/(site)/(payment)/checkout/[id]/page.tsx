import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { ServiceThumbnail } from "@/components/dashboard/shared/service-thumbnail";
import { formatCurrency, formatDate } from "@/lib/format";
import { getBookingById } from "@/lib/Action/api/get.data.api";
import type { CustomerBooking } from "@/types/type";
import { notFound } from "next/navigation";

const CHECKOUT_CONTENT_CLASS =
  "mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8";

function CheckoutBookingSkeleton() {
  return (
    <div className={CHECKOUT_CONTENT_CLASS} aria-hidden="true">
      <Skeleton className="h-8 w-44" />
      <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <Skeleton className="aspect-16/6 w-full rounded-none" />
        <div className="space-y-3 p-6">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
      <Skeleton className="mt-8 h-11 w-full sm:w-44" />
    </div>
  );
}

async function CheckoutBooking({ id }: { id: string }) {
  let booking: CustomerBooking | null = null;
  let error: string | null = null;

  try {
    booking = await getBookingById(id);
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load this booking. Please try again.";
  }

  if (error) {
    return (
      <div className={CHECKOUT_CONTENT_CLASS}>
        <Alert variant="destructive">
          <AlertTitle>Couldn&apos;t load this booking</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          render={<Link href="/dashboard/customer/bookings" />}
          variant="outline"
          className="mt-6"
        >
          Back to my bookings
        </Button>
      </div>
    );
  }

  if (!booking) {
    notFound();
  }

  const amount = booking.finalAmount ?? booking.basePrice;

  return (
    <div className={CHECKOUT_CONTENT_CLASS}>
      <div className="mt-8 rounded-xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <ServiceThumbnail
            title={booking.serviceTitle}
            image={booking.serviceImage}
            className="size-14 rounded-xl"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {booking.serviceTitle}
              </h2>
              <StatusBadge kind="booking" status={booking.status} />
            </div>
            {booking.category ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {booking.category}
              </p>
            ) : null}

            <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Technician
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {booking.technicianName}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Preferred date
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {formatDate(booking.preferredDate)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Amount
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {formatCurrency(amount)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Payment
                </dt>
                <dd className="mt-1">
                  <StatusBadge kind="payment" status={booking.paymentStatus} />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <Button
        type="button"
        render={<Link href="/checkout/success" />}
        size="lg"
        className="mt-8 bg-blue-600 text-white hover:bg-blue-700"
      >
        Pay Now
      </Button>
    </div>
  );
}

export default async function CheckoutPage({
  params,
}: PageProps<"/checkout/[id]">) {
  const { id } = await params;

  return (
    <Suspense fallback={<CheckoutBookingSkeleton />}>
      <CheckoutBooking id={id} />
    </Suspense>
  );
}
