import type { Metadata } from "next";
import { ReceiptText } from "lucide-react";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function AdminTransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transactions"
        description="Platform payment records will be available here once checkout is connected."
      />

      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <EmptyState
          icon={ReceiptText}
          title="No transactions yet"
          description="Stripe checkout records, amounts, and payout status will be listed on this page."
        />
      </div>
    </div>
  );
}
