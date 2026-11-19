import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import type {
  BookingStatus,
  PaymentStatus,
  ServiceApprovalStatus,
  StatusBadgeProps,
} from "@/types/type";

type BadgeMeta = {
  label: string;
  className: string;
};

const BOOKING_BADGES: Record<BookingStatus, BadgeMeta> = {
  requested: {
    label: "Requested",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300",
  },
  accepted: {
    label: "Accepted",
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/60 dark:text-indigo-300",
  },
  "in-progress": {
    label: "In progress",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/60 dark:text-amber-300",
  },
  completed: {
    label: "Completed",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/60 dark:text-rose-300",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

const PAYMENT_BADGES: Record<PaymentStatus, BadgeMeta> = {
  unpaid: {
    label: "Unpaid",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/60 dark:text-amber-300",
  },
  paid: {
    label: "Paid",
    className:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/70 dark:bg-teal-950/60 dark:text-teal-300",
  },
};

const APPROVAL_BADGES: Record<ServiceApprovalStatus, BadgeMeta> = {
  pending: {
    label: "Pending",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/60 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/60 dark:text-rose-300",
  },
};

export function StatusBadge(props: StatusBadgeProps) {
  const meta =
    props.kind === "booking"
      ? BOOKING_BADGES[props.status]
      : props.kind === "payment"
        ? PAYMENT_BADGES[props.status]
        : APPROVAL_BADGES[props.status];

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5", meta.className)}
    >
      {meta.label}
    </Badge>
  );
}
