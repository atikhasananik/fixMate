"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2, Wrench } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceCell } from "@/components/dashboard/service-thumbnail";
import { ServiceForm } from "@/components/dashboard/service-form";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { TableCard } from "@/components/dashboard/table-card";
import { useDashboardStore } from "@/components/dashboard/dashboard-store";
import { SERVICE_MODE_LABELS } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/format";
import type { ServiceFormValues, ServiceListing } from "@/types/type";

export function TechnicianServices() {
  const {
    viewer,
    services,
    updateService,
    deleteService,
    setServiceAvailability,
  } = useDashboardStore();

  const [editing, setEditing] = useState<ServiceListing | null>(null);
  const [deleting, setDeleting] = useState<ServiceListing | null>(null);

  function handleUpdate(values: ServiceFormValues) {
    if (!editing) {
      return;
    }

    updateService(editing.id, values);
    toast.add({
      type: "success",
      title: "Service updated",
      description: "Your changes were saved and sent back for approval.",
    });
    setEditing(null);
  }

  function handleDelete() {
    if (!deleting) {
      return;
    }

    deleteService(deleting.id);
    toast.add({
      type: "success",
      title: "Service deleted",
      description: `${deleting.title} was removed from your listings.`,
    });
    setDeleting(null);
  }

  function handleAvailability(service: ServiceListing, isAvailable: boolean) {
    setServiceAvailability(service.id, isAvailable);
    toast.add({
      type: "success",
      title: isAvailable ? "Service is available" : "Service hidden",
      description: isAvailable
        ? `${service.title} can be booked again.`
        : `${service.title} no longer appears on public pages.`,
    });
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
        description="An unavailable service is hidden from customers until you switch it back on."
      >
        {services.length === 0 ? (
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden md:table-cell">Mode</TableHead>
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
                      title={service.title}
                      category={service.category}
                      image={service.image}
                    />
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell">
                    {SERVICE_MODE_LABELS[service.serviceMode]}
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
                    <Switch
                      checked={service.isAvailable}
                      onCheckedChange={(checked) =>
                        handleAvailability(service, checked)
                      }
                      aria-label={`Toggle availability for ${service.title}`}
                    />
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
              mode="edit"
              technician={{ name: viewer.name, email: viewer.email }}
              initialValues={{
                title: editing.title,
                category: editing.category,
                description: editing.description,
                basePrice: String(editing.basePrice),
                estimatedDuration: editing.estimatedDuration,
                serviceMode: editing.serviceMode,
                serviceArea: editing.serviceArea,
                image: editing.image ?? "",
              }}
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
