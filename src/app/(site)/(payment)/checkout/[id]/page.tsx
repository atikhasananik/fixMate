import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { ServiceThumbnail } from "@/components/dashboard/shared/service-thumbnail";
import { formatCurrency, formatDate } from "@/lib/format";
import { getBookingById } from "@/lib/Action/api/customer/get";
import type { CustomerBooking } from "@/types/type";
import { PayNowButton } from "@/components/checkout/pay-now-button";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  Hash,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";

const CHECKOUT_CONTENT_CLASS =
  "mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8";

function CheckoutBookingSkeleton() {
  return (
    <div className={CHECKOUT_CONTENT_CLASS} aria-hidden="true">
      <Skeleton className="aspect-4/3 w-full rounded-xl" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-8 h-40 w-full rounded-xl" />
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
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Service image */}
        <div className="overflow-hidden rounded-xl h-[40vh] border border-border/60 bg-card shadow-sm">
          <ServiceThumbnail
            title={booking.serviceTitle}
            image={booking.serviceImage}
            className=" w-full h-full rounded-none border-0"
          />
        </div>

        {/* Booking details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {booking.serviceTitle}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge kind="booking" status={booking.status} />
              <StatusBadge kind="payment" status={booking.paymentStatus} />
            </div>
          </div>

          <dl className="grid gap-5 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Wrench
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Service
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {booking.serviceTitle}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hash
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Booking ID
                </dt>
                <dd className="mt-1 text-sm text-foreground">{booking.id}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Technician
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {booking.technicianName}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Preferred date
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {formatDate(booking.preferredDate)}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* Payment */}
      <section className="mt-8 rounded-xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            You&apos;re one step away from confirming your booking. Complete
            your payment securely to proceed.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total payable
            </p>
            <p className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
              <CreditCard
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              {formatCurrency(amount)}
            </p>
          </div>
          <PayNowButton bookingId={booking.id} />
        </div>
      </section>
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
