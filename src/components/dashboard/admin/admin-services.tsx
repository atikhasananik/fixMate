"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { ServiceCell } from "@/components/dashboard/shared/service-thumbnail";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { useDashboardStore } from "@/components/dashboard/shared/dashboard-store";
import { APPROVAL_STATUS_OPTIONS } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/format";
import type {
  ServiceApprovalStatus,
  ServiceListing,
} from "@/types/type";

type ApprovalFilter = ServiceApprovalStatus | "all";

const APPROVAL_PRIORITY: Record<ServiceApprovalStatus, number> = {
  pending: 0,
  rejected: 1,
  approved: 2,
};

export function AdminServices() {
  const { services, setServiceApprovalStatus } = useDashboardStore();
  const [filter, setFilter] = useState<ApprovalFilter>("pending");

  const filteredServices =
    filter === "all"
      ? services
      : services.filter((service) => service.approvalStatus === filter);

  const visibleServices = [...filteredServices].sort(
    (a, b) =>
      APPROVAL_PRIORITY[a.approvalStatus] - APPROVAL_PRIORITY[b.approvalStatus]
  );

  function handleDecision(
    service: ServiceListing,
    status: ServiceApprovalStatus
  ) {
    setServiceApprovalStatus(service.id, status);
    toast.add({
      type: "success",
      title: status === "approved" ? "Service approved" : "Service rejected",
      description:
        status === "approved"
          ? `${service.title} is now visible on the public services page.`
          : `${service.title} will not be shown to customers.`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Service Approval"
        description="Approve listings that are ready for customers, or reject the ones that need changes."
      />

      <TableCard
        title="All services"
        description="Pending listings are shown first so nothing waits too long."
        action={
          <Select
            value={filter}
            onValueChange={(value) =>
              setFilter((value ?? "all") as ApprovalFilter)
            }
          >
            <SelectTrigger className="w-40" aria-label="Filter by approval status">
              <SelectValue>
                {filter === "all"
                  ? "All statuses"
                  : APPROVAL_STATUS_OPTIONS.find(
                      (option) => option.value === filter
                    )?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {APPROVAL_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        {visibleServices.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Nothing to review"
            description={
              filter === "pending"
                ? "Every service has been reviewed. Switch the filter to see the full list."
                : "No services match this filter yet."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden md:table-cell">
                  Technician
                </TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <ServiceCell
                      title={service.title}
                      category={service.category}
                      image={service.image}
                    />
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell">
                    {service.technicianName}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap font-medium tabular-nums sm:table-cell">
                    {formatCurrency(service.basePrice)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      kind="approval"
                      status={service.approvalStatus}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={service.approvalStatus === "approved"}
                        onClick={() => handleDecision(service, "approved")}
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-900/70 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={service.approvalStatus === "rejected"}
                        onClick={() => handleDecision(service, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableCard>
    </div>
  );
}
