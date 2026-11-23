import { ReceiptText, TriangleAlert } from "lucide-react";
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
import { TableCard } from "@/components/dashboard/shared/table-card";
import { PaymentBadge } from "@/components/dashboard/customer/customer-payments";
import { getTransactionStats } from "@/lib/dashboard-data";
import { toPaymentRecordStatus } from "@/lib/Action/api/customer/get";
import { formatDate, formatMoney } from "@/lib/format";
import type {
  AdminTransactionsProps,
  PaymentApiDocument,
} from "@/types/type";

function getPaymentAmount(payment: PaymentApiDocument) {
  const amount = Number(payment.amount);

  return Number.isFinite(amount) ? amount : 0;
}

function getPaymentId(payment: PaymentApiDocument) {
  return payment._id ?? payment.transactionId ?? "";
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

function getBookingLabel(payment: PaymentApiDocument) {
  if (payment.bookingId) {
    return `#${payment.bookingId.slice(-6)}`;
  }

  return "—";
}

export function AdminTransactions({
  payments,
  error,
}: AdminTransactionsProps) {
  const stats = getTransactionStats(payments);

  if (error) {
    return (
      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="p-6">
          <EmptyState
            icon={TriangleAlert}
            title="Couldn't load transactions"
            description={error}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <StatsGrid stats={stats} className="sm:grid-cols-2 xl:grid-cols-4" />

      <TableCard
        title="Platform transactions"
        description="Every payment recorded on the platform, with customer and service context."
      >
        {payments.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No transactions yet"
            description="Completed repair payments will be listed here once checkout records them."
          />
        ) : (
          <>
            {/* Mobile & tablet: stacked cards to avoid horizontal scrolling. */}
            <div className="grid gap-3 p-4 xl:hidden">
              {payments.map((payment) => (
                <AdminPaymentCard key={getPaymentId(payment)} payment={payment} />
              ))}
            </div>

            {/* Desktop: the transactions table. */}
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
                  {payments.map((payment) => {
                    const status = toPaymentRecordStatus(payment.paymentStatus);
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
                          <div className="min-w-0">
                            <span className="block truncate font-medium text-foreground">
                              {getServiceLabel(payment)}
                            </span>
                            {payment.technicianName?.trim() ? (
                              <span className="block truncate text-xs text-muted-foreground">
                                {payment.technicianName}
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                          {formatMoney(amount, payment.currency)}
                        </TableCell>
                        <TableCell>
                          <PaymentBadge status={status} />
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
    </>
  );
}

function AdminPaymentCard({ payment }: { payment: PaymentApiDocument }) {
  const status = toPaymentRecordStatus(payment.paymentStatus);
  const amount = getPaymentAmount(payment);
  const customerName = payment.customerName?.trim();
  const customerEmail = payment.customerEmail?.trim();
  const technicianName = payment.technicianName?.trim();
  const transactionId = payment.transactionId;

  return (
    <Card className="gap-4 rounded-xl border border-border/70 py-4 shadow-none ring-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4">
        <div className="min-w-0">
          <CardTitle className="truncate text-sm">
            {getServiceLabel(payment)}
          </CardTitle>
          {customerName ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {customerName}
            </p>
          ) : null}
          {customerEmail ? (
            <p className="truncate text-xs text-muted-foreground">
              {customerEmail}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-base font-semibold tabular-nums">
            {formatMoney(amount, payment.currency)}
          </span>
          <PaymentBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="grid gap-3 px-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Paid on</p>
            <p className="mt-0.5 text-sm font-medium">{getPaidOn(payment)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Booking</p>
            <p className="mt-0.5 truncate text-sm font-medium">
              {getBookingLabel(payment)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Technician</p>
            <p className="mt-0.5 truncate text-sm font-medium">
              {technicianName ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="mt-0.5 text-sm font-medium tabular-nums">
              {formatMoney(amount, payment.currency)}
            </p>
          </div>
        </div>

        {transactionId ? (
          <div className="border-t border-border/60 pt-3">
            <p className="text-xs text-muted-foreground">Transaction ID</p>
            <p className="mt-0.5 break-all font-mono text-xs text-foreground">
              {transactionId}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

/** Placeholder shown while the admin transactions are being fetched. */
export function AdminTransactionsSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
      aria-hidden="true"
    >
      <div className="border-b border-border/60 px-4 py-4 sm:px-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-64 max-w-full" />
      </div>

      <div className="grid gap-3 p-4 xl:hidden">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-36 w-full rounded-xl" />
        ))}
      </div>

      <div className="hidden xl:block">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border/60 px-4 py-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
