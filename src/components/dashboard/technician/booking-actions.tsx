"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import type { BookingStatus, TechnicianBooking } from "@/types/type";

type BookingActionsProps = {
  booking: TechnicianBooking;
  isUpdating: boolean;
  onStatusChange: (
    status: BookingStatus,
    finalAmount?: number,
  ) => Promise<boolean>;
};

export function BookingActions({
  booking,
  isUpdating,
  onStatusChange,
}: BookingActionsProps) {
  const [isRejectConfirmationOpen, setIsRejectConfirmationOpen] =
    useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [finalAmount, setFinalAmount] = useState(String(booking.basePrice));
  const parsedFinalAmount = Number(finalAmount);
  const isFinalAmountValid =
    finalAmount.trim() !== "" &&
    Number.isFinite(parsedFinalAmount) &&
    parsedFinalAmount > 0;

  async function handleReject() {
    if (await onStatusChange("rejected")) {
      setIsRejectConfirmationOpen(false);
    }
  }

  async function handleComplete() {
    if (!isFinalAmountValid || isUpdating) {
      return;
    }

    if (await onStatusChange("completed", parsedFinalAmount)) {
      setIsCompleteDialogOpen(false);
    }
  }

  if (booking.status === "requested") {
    return (
      <>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={isUpdating}
            onClick={() => void onStatusChange("accepted")}
          >
            {isUpdating ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : null}
            Accept
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isUpdating}
            onClick={() => setIsRejectConfirmationOpen(true)}
          >
            Reject
          </Button>
        </div>

        <AlertDialog
          open={isRejectConfirmationOpen}
          onOpenChange={(open) => {
            if (!isUpdating) {
              setIsRejectConfirmationOpen(open);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject this repair request?</AlertDialogTitle>
              <AlertDialogDescription>
                This will notify the customer that you can&apos;t take the{" "}
                <strong>{booking.serviceTitle}</strong> request.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isUpdating}>
                Keep request
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isUpdating}
                onClick={(event) => {
                  event.preventDefault();
                  void handleReject();
                }}
              >
                {isUpdating ? "Rejecting…" : "Reject request"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (booking.status === "accepted") {
    return (
      <Button
        type="button"
        size="sm"
        disabled={isUpdating}
        onClick={() => void onStatusChange("in-progress")}
      >
        {isUpdating ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : null}
        Start Work
      </Button>
    );
  }

  if (booking.status === "in-progress") {
    return (
      <>
        <Button
          type="button"
          size="sm"
          disabled={isUpdating}
          onClick={() => {
            setFinalAmount(String(booking.basePrice));
            setIsCompleteDialogOpen(true);
          }}
        >
          Mark Completed
        </Button>

        <Dialog
          open={isCompleteDialogOpen}
          onOpenChange={(open) => {
            if (!isUpdating) {
              setIsCompleteDialogOpen(open);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete this booking</DialogTitle>
              <DialogDescription>
                Enter the final amount for {booking.serviceTitle}. The
                suggested amount is the service starting price.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label
                htmlFor={`final-amount-${booking.id}`}
                className="text-sm font-medium"
              >
                Final amount
              </label>
              <Input
                id={`final-amount-${booking.id}`}
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={finalAmount}
                onChange={(event) => setFinalAmount(event.currentTarget.value)}
                aria-invalid={!isFinalAmountValid}
                disabled={isUpdating}
              />
              {!isFinalAmountValid ? (
                <p className="text-sm text-destructive">
                  Enter an amount greater than zero.
                </p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
                onClick={() => setIsCompleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isUpdating || !isFinalAmountValid}
                onClick={() => void handleComplete()}
              >
                {isUpdating ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  "Confirm completion"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <span className="text-sm text-center text-muted-foreground">-</span>;
}
