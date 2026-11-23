import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AdminTransactions,
  AdminTransactionsSkeleton,
} from "@/components/dashboard/admin/admin-transactions";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getAllPayments } from "@/lib/Action/api/admin/get";
import type { PaymentApiDocument } from "@/types/type";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function AdminTransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transactions"
        description="Every payment collected on the platform, across all customers and technicians."
      />

      <Suspense fallback={<AdminTransactionsSkeleton />}>
        <AdminTransactionsSection />
      </Suspense>
    </div>
  );
}

async function AdminTransactionsSection() {
  let payments: PaymentApiDocument[] = [];
  let error: string | null = null;

  try {
    payments = await getAllPayments();
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load transactions. Please try again.";
  }

  return <AdminTransactions payments={payments} error={error} />;
}
