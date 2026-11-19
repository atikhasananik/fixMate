import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";

export const metadata: Metadata = {
  title: "Manage Requests",
};

export default function TechnicianRequestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Requests"
        description="Incoming repair requests will be listed here so you can accept or reject them."
      />

      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <EmptyState
          icon={Inbox}
          title="Request management is coming soon"
          description="Accepting, rejecting, and updating job progress will be wired to the bookings API."
        />
      </div>
    </div>
  );
}
