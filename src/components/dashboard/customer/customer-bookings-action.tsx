"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { TableCell } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { updateBookingStatus } from "@/lib/Action/api/update.data.api";
import type { BookingStatus } from "@/types/type";

interface CustomerBookingsActionProps {
  currentStatus: BookingStatus;
  id: string;
  serviceTitle: string;
}

export default function CustomerBookingsAction({
  currentStatus,
  id,
  serviceTitle,
}: CustomerBookingsActionProps) {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const canCancel = currentStatus === "requested";

  async function handleConfirmCancellation() {
    if (!canCancel || isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await updateBookingStatus(id, "cancelled");

      if (response.success === false) {
        throw new Error(
          response.result?.message ??
            response.message ??
            "The booking could not be cancelled.",
        );
      }

      toast.add({
        type: "success",
        title: "Booking cancelled",
        description: `${serviceTitle} has been cancelled.`,
      });
      setIsConfirmationOpen(false);
      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Couldn't cancel booking",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <TableCell>
      <div className="flex justify-end gap-2">
        {canCancel ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsConfirmationOpen(true)}
          >
            Cancel
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>

      <AlertDialog
        open={isConfirmationOpen}
        onOpenChange={(open) => {
          if (!isUpdating) {
            setIsConfirmationOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this repair request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel <strong>{serviceTitle}</strong>?
              This action can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isUpdating}
              onClick={handleConfirmCancellation}
            >
              {isUpdating ? "Cancelling…" : "Yes, cancel request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TableCell>
  );
}
