import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Payment History",
};

export default function CustomerPaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payment History"
        description="Completed repairs and their payment receipts will appear here."
      />

      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <EmptyState
          icon={CreditCard}
          title="No payments recorded yet"
          description="Once secure checkout is connected, every paid repair and its receipt will be listed on this page."
        />
      </div>
    </div>
  );
}
