import { CreditCard, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { formatDate, formatMoney } from "@/lib/format";
import type {
  CustomerPayment,
  CustomerPaymentsProps,
  PaymentRecordStatus,
} from "@/types/type";

const MUTED_BADGE_CLASS =
  "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";

/** Statuses Stripe can report that a booking's paid/unpaid flag has no badge for. */
const OTHER_PAYMENT_LABELS: Record<"no_payment_required" | "unknown", string> = {
  no_payment_required: "No payment due",
  unknown: "Unknown",
};

/** Paid/unpaid reuse the shared badge; other Stripe values get a neutral one. */
export function PaymentBadge({ status }: { status: PaymentRecordStatus }) {
  if (status === "paid" || status === "unpaid") {
    return <StatusBadge kind="payment" status={status} />;
  }

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5", MUTED_BADGE_CLASS)}
    >
      {OTHER_PAYMENT_LABELS[status]}
    </Badge>
  );
}

/** Older payments have no `serviceTitle`; fall back to the booking reference. */
function getServiceLabel(payment: CustomerPayment) {
  if (payment.serviceTitle) {
    return payment.serviceTitle;
  }

  if (payment.bookingId) {
    return `Booking #${payment.bookingId.slice(-6)}`;
  }

  return "Repair service";
}

function getPaidOn(payment: CustomerPayment) {
  return payment.paidAt ? formatDate(payment.paidAt) : "—";
}

export function CustomerPayments({ payments, error }: CustomerPaymentsProps) {
  return (
    <TableCard
      title="Payment history"
      description="Receipts for every repair payment on your account."
    >
      {error ? (
        <div className="p-6">
          <Alert variant="destructive">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Couldn&apos;t load your payments</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Once you pay for a completed repair, the receipt and transaction details will be listed here."
        />
      ) : (
        <>
          <div className="grid gap-3 p-4 lg:hidden">
            {payments.map((payment) => (
              <Card
                key={payment.id}
                className="gap-4 rounded-xl border border-border/70 py-4 shadow-none ring-0"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-3 px-4">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-sm">
                      {getServiceLabel(payment)}
                    </CardTitle>
                    {payment.technicianName ? (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {payment.technicianName}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-base font-semibold tabular-nums">
                      {formatMoney(payment.amount, payment.currency)}
                    </span>
                    <PaymentBadge status={payment.status} />
                  </div>
                </CardHeader>

                <CardContent className="grid gap-3 px-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Paid on</p>
                      <p className="mt-0.5 text-sm font-medium">
                        {getPaidOn(payment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Booking</p>
                      <p className="mt-0.5 truncate text-sm font-medium">
                        {payment.bookingId
                          ? `#${payment.bookingId.slice(-6)}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-3">
                    <p className="text-xs text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="mt-0.5 break-all font-mono text-xs text-foreground">
                      {payment.transactionId ?? "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="whitespace-nowrap">
                      {getPaidOn(payment)}
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <span className="block truncate font-medium text-foreground">
                          {getServiceLabel(payment)}
                        </span>
                        {payment.technicianName ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {payment.technicianName}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium tabular-nums">
                      {formatMoney(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell>
                      <PaymentBadge status={payment.status} />
                    </TableCell>
                    <TableCell
                      className="max-w-[220px] truncate font-mono text-xs text-muted-foreground"
                      title={payment.transactionId}
                    >
                      {payment.transactionId ?? "—"}
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

/** Placeholder shown while the payment history is being fetched. */
export function CustomerPaymentsSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
      aria-hidden="true"
    >
      <div className="border-b border-border/60 px-4 py-4 sm:px-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-64 max-w-full" />
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>

      <div className="hidden lg:block">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border/60 px-4 py-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
