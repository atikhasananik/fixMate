import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Customer Dashboard",
};

export default function CustomerDashboardPage() {
  return (
    <PagePlaceholder
      title="Customer Dashboard"
      description="Track repair requests, review job progress, and manage payments from one place."
    />
  );
}
