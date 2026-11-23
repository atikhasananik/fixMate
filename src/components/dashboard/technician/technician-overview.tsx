import Link from "next/link";
import {
  ArrowUpRight,
  CircleCheck,
  ClipboardList,
  Hammer,
  Inbox,
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
import { StatsGrid } from "@/components/dashboard/shared/stat-card";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { getTechnicianStats } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/format";
import type { TechnicianBooking } from "@/types/type";

const RECENT_JOBS_LIMIT = 5;

type TechnicianOverviewProps = {
  bookings: TechnicianBooking[];
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
    title: "Assigned jobs",
    description: "See every repair request assigned to you.",
    href: "/dashboard/technician/requests",
    icon: ClipboardList,
  },
  {
    title: "Pending requests",
    description: "New jobs waiting for your response.",
    href: "/dashboard/technician/requests?status=requested",
    icon: Inbox,
  },
  {
    title: "In progress",
    description: "Accepted jobs that still need work.",
    href: "/dashboard/technician/requests?status=in-progress",
    icon: Wrench,
  },
  {
    title: "Completed jobs",
    description: "Repairs you have already finished.",
    href: "/dashboard/technician/requests?status=completed",
    icon: CircleCheck,
  },
  {
    title: "My services",
    description: "Manage your listings and their availability.",
    href: "/dashboard/technician/my-services",
    icon: Hammer,
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
    <section
      aria-labelledby="quick-actions-heading"
      className="flex flex-col gap-3"
    >
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {QUICK_LINKS.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={title}
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

function RecentJobs({ bookings }: { bookings: TechnicianBooking[] }) {
  return (
    <TableCard
      title="Recent jobs"
      description="The latest repair requests assigned to you."
      action={
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/technician/requests" />}
          variant="outline"
          size="sm"
        >
          View all jobs
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      }
    >
      {bookings.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No jobs assigned yet"
          description="New repair requests assigned to you will appear here."
        />
      ) : (
        <ul className="divide-y divide-border/60">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                  <Wrench className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {booking.serviceTitle}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {booking.customerName}
                    {booking.address ? ` · ${booking.address}` : ""}
                    {booking.preferredDate
                      ? ` · ${formatDate(booking.preferredDate)}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="pl-13 sm:pl-0">
                <StatusBadge kind="booking" status={booking.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </TableCard>
  );
}

export function TechnicianOverview({
  bookings,
  error,
}: TechnicianOverviewProps) {
  // Newest jobs first; bookings have no createdAt, so the preferred date is used.
  const recentJobs = [...bookings]
    .sort((a, b) => (b.preferredDate ?? "").localeCompare(a.preferredDate ?? ""))
    .slice(0, RECENT_JOBS_LIMIT);

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
          stats={getTechnicianStats(bookings)}
          className="sm:grid-cols-2 xl:grid-cols-4"
        />
      )}

      <QuickActions />

      {error ? null : <RecentJobs bookings={recentJobs} />}
    </div>
  );
}

/** Placeholder shown while the technician's jobs are being fetched. */
export function TechnicianOverviewSkeleton() {
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
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
