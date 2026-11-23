"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, TriangleAlert, Wrench } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ServiceForm } from "@/components/dashboard/shared/service-form";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { useDashboardStore } from "@/components/dashboard/shared/dashboard-store";
import { SERVICE_MODE_LABELS } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/format";
import type {
  ServiceFormValues,
  TechnicianService,
  TechnicianServicesProps,
} from "@/types/type";
import { deleteService } from "@/lib/Action/api/technician/delete";
import {
  updateServiceAvailability,
  updateServiceData,
} from "@/lib/Action/api/technician/update";
import { buildServiceFields } from "@/lib/service-payload";

type ServiceCardProps = {
  service: TechnicianService;
  isUpdating: boolean;
  isAvailabilityUpdateRunning: boolean;
  onAvailabilityChange: (service: TechnicianService, isAvailable: boolean) => void;
  onEdit: (service: TechnicianService) => void;
  onDelete: (service: TechnicianService) => void;
};

function ServiceCard({
  service,
  isUpdating,
  isAvailabilityUpdateRunning,
  onAvailabilityChange,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <Card className="gap-4 rounded-xl border border-border/70 py-4 shadow-none ring-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4">
        <div className="min-w-0">
          <CardTitle className="truncate text-sm">
            {service.title || "Untitled service"}
          </CardTitle>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {service.category || "Uncategorized"}
          </p>
        </div>
        <StatusBadge kind="approval" status={service.approvalStatus} />
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 px-4">
        <div>
          <p className="text-xs text-muted-foreground">Mode</p>
          <p className="mt-0.5 text-sm font-medium">
            {SERVICE_MODE_LABELS[service.serviceMode] ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="mt-0.5 text-sm font-medium tabular-nums">
            {formatCurrency(service.basePrice)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="mt-0.5 text-sm font-medium">
            {service.estimatedDuration || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Service area</p>
          <p className="mt-0.5 truncate text-sm font-medium">
            {service.serviceArea || "—"}
          </p>
        </div>

        <div className="col-span-2 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="text-sm font-medium">Available to customers</span>
          <div className="flex items-center gap-2">
            <Switch
              checked={service.isAvailable}
              disabled={isAvailabilityUpdateRunning}
              onCheckedChange={(checked) =>
                onAvailabilityChange(service, checked)
              }
              aria-label={`Toggle availability for ${service.title}`}
            />
            {isUpdating ? <Spinner className="size-3.5" /> : null}
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(service)}
          >
            <Pencil aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(service)}
          >
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TechnicianServices({
  services: initialServices,
  error,
}: TechnicianServicesProps) {
  const router = useRouter();
  const { viewer } = useDashboardStore();
  const [services, setServices] = useState(initialServices);
  const [serverServices, setServerServices] = useState(initialServices);
  const [editing, setEditing] = useState<TechnicianService | null>(null);
  const [deleting, setDeleting] = useState<TechnicianService | null>(null);
  const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState<
    string | null
  >(null);

  // Pick up fresh server data after `router.refresh()` retries a failed load.
  if (initialServices !== serverServices) {
    setServerServices(initialServices);
    setServices(initialServices);
  }

  async function handleUpdate(values: ServiceFormValues) {
    if (!editing) {
      return;
    }

    try {
      await updateServiceData(editing.id, buildServiceFields(values));
    } catch (error) {
      toast.add({
        type: "error",
        title: "Couldn't update the service",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Service updated",
      description: "Your changes were saved and sent back for approval.",
    });
    setEditing(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) {
      return;
    }
    const deleteServiceByID = await deleteService(deleting.id);
    if (deleteServiceByID) {
      router.refresh();
    }

    toast.add({
      type: "success",
      title: "Service deleted",
      description: `${deleting.title} was removed from your listings.`,
    });
    setDeleting(null);
  }

  async function handleAvailability(
    service: TechnicianService,
    isAvailable: boolean,
  ) {
    // One availability update at a time; ignore clicks while it is running.
    if (updatingAvailabilityId) {
      return;
    }

    setUpdatingAvailabilityId(service.id);

    try {
      await updateServiceAvailability(service.id, isAvailable);

      // The backend confirmed, so reflect the new value in the table.
      setServices((previous) =>
        previous.map((item) =>
          item.id === service.id ? { ...item, isAvailable } : item,
        ),
      );

      toast.add({
        type: "success",
        title: isAvailable ? "Service is available" : "Service hidden",
        description: isAvailable
          ? `${service.title} can be booked again.`
          : `${service.title} no longer appears on public pages.`,
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Couldn't update availability",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setUpdatingAvailabilityId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Services"
        description="Edit listings, control availability, and keep track of approval status."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/technician/add-service" />}
            className="h-9 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
          >
            <Plus aria-hidden="true" />
            Add service
          </Button>
        }
      />

      <TableCard
        title="All services"
        description={
          error
            ? "Reload the page to try fetching your services again."
            : "An unavailable service is hidden from customers until you switch it back on."
        }
      >
        {error ? (
          <EmptyState
            icon={TriangleAlert}
            title="Couldn't load your services"
            description={error}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.refresh()}
              className="mt-2"
            >
              Try again
            </Button>
          </EmptyState>
        ) : services.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No services yet"
            description="Add your first repair service and send it for admin approval."
          >
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/technician/add-service" />}
              className="mt-2 h-9 bg-blue-600 text-white hover:bg-blue-700"
            >
              Add service
            </Button>
          </EmptyState>
        ) : (
          <>
            <div className="grid gap-3 p-4 lg:hidden">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isUpdating={updatingAvailabilityId === service.id}
                  isAvailabilityUpdateRunning={Boolean(updatingAvailabilityId)}
                  onAvailabilityChange={handleAvailability}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <ServiceCell
                          title={service.title || "Untitled service"}
                          category={service.category || "Uncategorized"}
                          image={service.image}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {SERVICE_MODE_LABELS[service.serviceMode] ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {service.estimatedDuration || "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium tabular-nums">
                        {formatCurrency(service.basePrice)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          kind="approval"
                          status={service.approvalStatus}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.isAvailable}
                            disabled={Boolean(updatingAvailabilityId)}
                            onCheckedChange={(checked) =>
                              handleAvailability(service, checked)
                            }
                            aria-label={`Toggle availability for ${service.title}`}
                          />
                          {updatingAvailabilityId === service.id ? (
                            <Spinner className="size-3.5" />
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(service)}
                          >
                            <Pencil aria-hidden="true" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleting(service)}
                          >
                            <Trash2 aria-hidden="true" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </TableCard>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
            <DialogDescription>
              Saving sends this listing back to admin approval.
            </DialogDescription>
          </DialogHeader>

          {editing ? (
            <ServiceForm
              key={editing.id}
              service={editing}
              technician={{ name: viewer.name, email: viewer.email }}
              onSubmit={handleUpdate}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `${deleting.title} will be removed permanently. Existing bookings are not affected.`
                : "This service will be removed permanently."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep service</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
