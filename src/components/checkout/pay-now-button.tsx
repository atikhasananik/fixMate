"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createPaymentIntent } from "@/lib/Action/api/get.data.api";

type PayNowButtonProps = {
  bookingId: string;
};

export function PayNowButton({ bookingId }: PayNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePayNow() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await createPaymentIntent({ bookingId });
      const url = data?.result?.url;

      if (!url) {
        throw new Error("The payment session could not be created.");
      }

      window.location.href = url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't start the payment.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-3 sm:w-auto">
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        onClick={handlePayNow}
        disabled={isLoading}
        size="lg"
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        {isLoading ? "Processing…" : "Pay Now"}
      </Button>
    </div>
  );
}
