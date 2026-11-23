import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  CreditCard,
  TriangleAlert,
  UserRound,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { ServiceThumbnail } from "@/components/dashboard/shared/service-thumbnail";
import { StatsGrid } from "@/components/dashboard/shared/stat-card";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { getCustomerStats } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/format";
import type { CustomerBooking, CustomerPayment } from "@/types/type";

const RECENT_BOOKINGS_LIMIT = 4;

type CustomerOverviewProps = {
  bookings: CustomerBooking[];
  payments: CustomerPayment[];
  error?: string | null;
};

type QuickLink = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const QUICK_LINKS: QuickLink[] = [
  {
    title: "Browse services",
    description: "Find approved repairs and book a technician.",
    href: "/services",
    icon: Wrench,
  },
  {
    title: "My bookings",
    description: "Track every request and its latest status.",
    href: "/dashboard/customer/bookings",
    icon: ClipboardList,
  },
  {
    title: "Payment history",
    description: "Review receipts and transaction references.",
    href: "/dashboard/customer/payments",
    icon: CreditCard,
  },
  {
    title: "Update profile",
    description: "Keep your contact details up to date.",
    href: "/dashboard/profile",
    icon: UserRound,
  },
];

function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading" className="flex flex-col gap-3">
      <div>
        <h2
          id="quick-actions-heading"
          className="font-heading text-base font-medium text-foreground"
        >
          Quick actions
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Jump to the pages you use most.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_LINKS.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Card className="h-full gap-3 border border-border/70 py-4 shadow-sm ring-0 transition-all duration-200 group-hover:border-blue-300 group-hover:shadow-md dark:group-hover:border-blue-800">
              <CardHeader className="gap-2 px-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle className="flex items-center gap-1 text-sm">
                  {title}
                  <ArrowUpRight
                    className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </CardTitle>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RecentBookings({ bookings }: { bookings: CustomerBooking[] }) {
  return (
    <TableCard
      title="Recent bookings"
      description="Your latest repair requests."
      action={
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/customer/bookings" />}
          variant="outline"
          size="sm"
        >
          View all
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      }
    >
      {bookings.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No bookings yet"
          description="Browse approved services and send your first repair request."
        >
          <Button nativeButton={false} render={<Link href="/services" />}>
            Browse services
          </Button>
        </EmptyState>
      ) : (
        <ul className="divide-y divide-border/60">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ServiceThumbnail
                  title={booking.serviceTitle}
                  image={booking.serviceImage}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {booking.serviceTitle}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {booking.category ? `${booking.category} · ` : ""}
                    {booking.preferredDate
                      ? formatDate(booking.preferredDate)
                      : "Date not set"}
                  </p>
                </div>
              </div>

              <div className="pl-14 sm:pl-0">
                <StatusBadge kind="booking" status={booking.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </TableCard>
  );
}

export function CustomerOverview({
  bookings,
  payments,
  error,
}: CustomerOverviewProps) {
  // Newest requests first; the API returns them in insertion order.
  const recentBookings = [...bookings]
    .sort((a, b) => (b.preferredDate ?? "").localeCompare(a.preferredDate ?? ""))
    .slice(0, RECENT_BOOKINGS_LIMIT);

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Couldn&apos;t load your dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <StatsGrid
          stats={getCustomerStats(bookings, payments)}
          className="sm:grid-cols-2 xl:grid-cols-4"
        />
      )}

      <QuickActions />

      {error ? null : <RecentBookings bookings={recentBookings} />}
    </div>
  );
}

/** Placeholder shown while bookings and payments are being fetched. */
export function CustomerOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton
            key={index}
            className="h-28 w-full rounded-xl border border-border/60"
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton
            key={index}
            className="h-32 w-full rounded-xl border border-border/60"
          />
        ))}
      </div>

      <Skeleton className="h-64 w-full rounded-xl border border-border/60" />
    </div>
  );
}
