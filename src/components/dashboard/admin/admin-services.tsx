"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
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
import { updateServiceApprovalStatus } from "@/lib/Action/api/update.data.api";
import {
  buildAdminServicesSearchParams,
  readAdminServiceParam,
} from "@/lib/admin-services-query";
import { APPROVAL_STATUS_OPTIONS } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/format";
import type {
  AdminServicesProps,
  ServiceApprovalStatus,
  TechnicianService,
} from "@/types/type";

type ApprovalFilter = ServiceApprovalStatus | "all";

export function AdminServices({
  services,
  error,
  searchParams,
}: AdminServicesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(
    null,
  );

  // The URL is the source of truth for the filter; the backend does the work.
  const approvalParam = readAdminServiceParam(searchParams, "approvalStatus");
  const filter: ApprovalFilter = APPROVAL_STATUS_OPTIONS.some(
    (option) => option.value === approvalParam,
  )
    ? (approvalParam as ServiceApprovalStatus)
    : "all";

  function handleFilterChange(value: string) {
    const searchString = buildAdminServicesSearchParams(searchParams, {
      approvalStatus: value === "all" ? null : value,
    });
    const href = searchString ? `${pathname}?${searchString}` : pathname;

    // push (not replace) so back/forward steps through filter states.
    startTransition(() => router.push(href, { scroll: false }));
  }

  async function handleDecision(
    service: TechnicianService,
    status: ServiceApprovalStatus,
  ) {
    // One decision at a time; ignore clicks while it is running.
    if (updatingServiceId) {
      return;
    }

    setUpdatingServiceId(service.id);

    try {
      await updateServiceApprovalStatus(service.id, status);

      toast.add({
        type: "success",
        title: status === "approved" ? "Service approved" : "Service rejected",
        description:
          status === "approved"
            ? `${service.title} is now visible on the public services page.`
            : `${service.title} will not be shown to customers.`,
      });

      // Re-fetch the server listing so the active filter and review order
      // are re-applied by the backend.
      startTransition(() => router.refresh());
    } catch (updateError) {
      toast.add({
        type: "error",
        title: "Couldn't update the service",
        description:
          updateError instanceof Error
            ? updateError.message
            : "Please try again in a moment.",
      });
    } finally {
      setUpdatingServiceId(null);
    }
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
          <div className="flex items-center gap-2">
            <Select
              value={filter}
              onValueChange={(value) => handleFilterChange(value ?? "all")}
              disabled={isPending}
            >
              <SelectTrigger
                className="w-40"
                aria-label="Filter by approval status"
              >
                <SelectValue>
                  {filter === "all"
                    ? "All statuses"
                    : APPROVAL_STATUS_OPTIONS.find(
                        (option) => option.value === filter,
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
            {isPending ? <Spinner className="size-3.5" /> : null}
          </div>
        }
      >
        {error ? (
          <EmptyState
            icon={TriangleAlert}
            title="Couldn't load services"
            description={error}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => startTransition(() => router.refresh())}
              className="mt-2"
            >
              Try again
            </Button>
          </EmptyState>
        ) : services.length === 0 ? (
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
              {services.map((service) => {
                const isUpdating = updatingServiceId === service.id;

                return (
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
                      <div className="flex items-center justify-end gap-2">
                        {isUpdating ? (
                          <Spinner className="size-3.5" />
                        ) : null}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            isUpdating || service.approvalStatus === "approved"
                          }
                          onClick={() => handleDecision(service, "approved")}
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-900/70 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={
                            isUpdating || service.approvalStatus === "rejected"
                          }
                          onClick={() => handleDecision(service, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableCard>
    </div>
  );
}
