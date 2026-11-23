import type { Metadata } from "next";
import { Suspense } from "react";
import {
  CustomerPayments,
  CustomerPaymentsSkeleton,
} from "@/components/dashboard/customer/customer-payments";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getPaymentData } from "@/lib/Action/api/customer/get";
import { getDashboardSession } from "@/lib/dashboard-session";
import type { CustomerPayment } from "@/types/type";

export const metadata: Metadata = {
  title: "Payment History",
};

export default async function CustomerPaymentsPage() {
  // Only the signed-in customer's payments are ever requested.
  const session = await getDashboardSession();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payment History"
        description="Every repair payment on your account, with receipts and transaction references."
      />

      <Suspense fallback={<CustomerPaymentsSkeleton />}>
        <PaymentHistorySection email={session.user.email} />
      </Suspense>
    </div>
  );
}

async function PaymentHistorySection({ email }: { email: string }) {
  let payments: CustomerPayment[] = [];
  let errorMessage: string | null = null;

  try {
    payments = await getPaymentData(email);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Couldn't load your payments. Please try again.";
  }

  return <CustomerPayments payments={payments} error={errorMessage} />;
}
