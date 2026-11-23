import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  ReceiptText,
  TriangleAlert,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { StatsGrid } from "@/components/dashboard/shared/stat-card";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { getPlatformStats } from "@/lib/dashboard-data";
import { formatDate, formatMoney } from "@/lib/format";
import type { AdminOverviewProps } from "@/types/type";
import type { AdminBooking, PaymentApiDocument } from "@/types/type";

const RECENT_BOOKINGS_LIMIT = 5;
const RECENT_TRANSACTIONS_LIMIT = 5;

type QuickLink = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const QUICK_LINKS: QuickLink[] = [
  {
    title: "Manage users",
    description: "Review and manage platform accounts.",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Manage services",
    description: "Review technician listings and availability.",
    href: "/dashboard/admin/services",
    icon: Wrench,
  },
  {
    title: "Manage bookings",
    description: "Monitor repair requests across the platform.",
    href: "/dashboard/admin/bookings",
    icon: CalendarDays,
  },
  {
    title: "Transactions",
    description: "Review payment records and revenue.",
    href: "/dashboard/admin/transactions",
    icon: ReceiptText,
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

function getPaymentAmount(payment: PaymentApiDocument) {
  const amount = Number(payment.amount);

  return Number.isFinite(amount) ? amount : 0;
}

function getServiceLabel(payment: PaymentApiDocument) {
  const serviceTitle = payment.serviceTitle?.trim();

  if (serviceTitle) {
    return serviceTitle;
  }

  if (payment.bookingId) {
    return `Booking #${payment.bookingId.slice(-6)}`;
  }

  return "Repair service";
}

function getPaidOn(payment: PaymentApiDocument) {
  return payment.paidAt ? formatDate(payment.paidAt) : "—";
}

function getPaymentId(payment: PaymentApiDocument) {
  return payment._id ?? payment.transactionId ?? "";
}

function RecentBookings({ bookings }: { bookings: AdminBooking[] }) {
  const recentBookings = [...bookings]
    .sort((a, b) => (b.preferredDate ?? "").localeCompare(a.preferredDate ?? ""))
    .slice(0, RECENT_BOOKINGS_LIMIT);

  return (
    <TableCard
      title="Recent bookings"
      description="The latest repair requests across the platform."
      action={
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/admin/bookings" />}
          variant="outline"
          size="sm"
        >
          View all bookings
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      }
    >
      {recentBookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings yet"
          description="New repair requests will appear here."
        />
      ) : (
        <>
          {/* Mobile & tablet: stacked cards to avoid horizontal scrolling. */}
          <div className="grid gap-3 p-4 xl:hidden">
            {recentBookings.map((booking) => (
              <RecentBookingCard key={booking.id} booking={booking} />
            ))}
          </div>

          {/* Desktop: the bookings table. */}
          <div className="hidden xl:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                      {booking.serviceTitle}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </TableCard>
  );
}

function RecentBookingCard({ booking }: { booking: AdminBooking }) {
  const amount = booking.finalAmount ?? booking.basePrice;

  return (
    <Card className="gap-4 rounded-xl border border-border/70 py-4 shadow-none ring-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4">
        <div className="min-w-0">
          <CardTitle className="truncate text-sm">{booking.serviceTitle}</CardTitle>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {booking.customerName}
          </p>
        </div>
        <StatusBadge kind="booking" status={booking.status} />
      </CardHeader>

      <CardContent className="grid gap-3 px-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <dt className="text-xs text-muted-foreground">Technician</dt>
            <dd className="mt-0.5 text-sm font-medium">{booking.technicianName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Preferred date</dt>
            <dd className="mt-0.5 text-sm font-medium">
              {formatDate(booking.preferredDate)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Amount</dt>
            <dd className="mt-0.5 text-sm font-medium tabular-nums">
              {formatMoney(amount, "USD")}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Customer</dt>
            <dd className="mt-0.5 truncate text-sm font-medium">
              {booking.customerName}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function RecentTransactions({ payments }: { payments: PaymentApiDocument[] }) {
  const recentPayments = [...payments]
    .sort((a, b) => (b.paidAt ?? "").localeCompare(a.paidAt ?? ""))
    .slice(0, RECENT_TRANSACTIONS_LIMIT);

  return (
    <TableCard
      title="Recent transactions"
      description="The latest payment activity across the platform."
      action={
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/admin/transactions" />}
          variant="outline"
          size="sm"
        >
          View all transactions
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      }
    >
      {recentPayments.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No transactions yet"
          description="Completed repair payments will appear here."
        />
      ) : (
        <>
          {/* Mobile & tablet: stacked cards to avoid horizontal scrolling. */}
          <div className="grid gap-3 p-4 xl:hidden">
            {recentPayments.map((payment) => (
              <RecentPaymentCard key={getPaymentId(payment)} payment={payment} />
            ))}
          </div>
          <div className="hidden xl:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid on</TableHead>
                  <TableHead>Transaction</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentPayments.map((payment) => {
                  const status =
                    payment.paymentStatus === "paid" ||
                    payment.paymentStatus === "unpaid" ||
                    payment.paymentStatus === "no_payment_required"
                      ? payment.paymentStatus
                      : "unpaid";
                  const amount = getPaymentAmount(payment);

                  return (
                    <TableRow key={getPaymentId(payment)}>
                      <TableCell>
                        <div className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {payment.customerName?.trim() || "Unknown customer"}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {payment.customerEmail?.trim() || "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="block truncate font-medium text-foreground">
                          {getServiceLabel(payment)}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                        {formatMoney(amount, payment.currency)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          kind="payment"
                          status={status as "paid" | "unpaid"}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getPaidOn(payment)}
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate font-mono text-xs text-muted-foreground">
                        {payment.transactionId ?? "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </TableCard>
  );
}

function RecentPaymentCard({ payment }: { payment: PaymentApiDocument }) {
  const status = payment.paymentStatus === "paid" || payment.paymentStatus === "unpaid" ? payment.paymentStatus : "unpaid";
  const amount = Number(payment.amount);
  const value = Number.isFinite(amount) ? amount : 0;

  return (
    <Card className="gap-4 rounded-xl border border-border/70 py-4 shadow-none ring-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4">
        <div className="min-w-0">
          <CardTitle className="truncate text-sm">
            {getServiceLabel(payment)}
          </CardTitle>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {payment.customerName?.trim() || "Unknown customer"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {payment.customerEmail?.trim() || "—"}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-base font-semibold tabular-nums">
            {formatMoney(value, payment.currency)}
          </span>
          <StatusBadge
            kind="payment"
            status={status as "paid" | "unpaid"}
          />
        </div>
      </CardHeader>

      <CardContent className="grid gap-3 px-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <dt className="text-xs text-muted-foreground">Paid on</dt>
            <dd className="mt-0.5 text-sm font-medium">{getPaidOn(payment)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Amount</dt>
            <dd className="mt-0.5 text-sm font-medium tabular-nums">
              {formatMoney(value, payment.currency)}
            </dd>
          </div>
        </dl>

        {payment.transactionId ? (
          <div className="border-t border-border/60 pt-3">
            <p className="text-xs text-muted-foreground">Transaction ID</p>
            <p className="mt-0.5 break-all font-mono text-xs text-foreground">
              {payment.transactionId}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function AdminOverview({
  users,
  services,
  bookings,
  payments,
  error,
}: AdminOverviewProps) {
  const stats = getPlatformStats(users, services, bookings, payments);

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <div className="rounded-xl border border-border/70 bg-card shadow-sm">
          <div className="p-6">
            <EmptyState
              icon={TriangleAlert}
              title="Couldn't load your dashboard"
              description={error}
            />
          </div>
        </div>
      ) : (
        <>
          <StatsGrid stats={stats} className="sm:grid-cols-2 xl:grid-cols-3" />

          <QuickActions />

          <RecentBookings bookings={bookings} />

          <RecentTransactions payments={payments} />
        </>
      )}
    </div>
  );
}

/** Placeholder shown while the admin overview is being fetched. */
export function AdminOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
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

      <Skeleton className="h-64 w-full rounded-xl border border-border/60" />
    </div>
  );
}
