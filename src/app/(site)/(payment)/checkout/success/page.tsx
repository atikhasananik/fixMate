import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, ClipboardList, House } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Successful",
};

export default function SuccessPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-500/10">
            <CircleCheck className="size-16 text-emerald-500" aria-hidden="true" />
            <span className="absolute inset-0 animate-ping rounded-full border border-emerald-500/30" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Payment Successful!
          </h1>

          <p className="max-w-md text-base text-muted-foreground">
            Your payment has been completed successfully. Thank you for choosing
            our service!
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button render={<Link href="/dashboard/customer/bookings" />} variant="outline">
            <ClipboardList className="size-4" aria-hidden="true" />
            View My Bookings
          </Button>
          <Button render={<Link href="/" />}>
            <House className="size-4" aria-hidden="true" />
            Back to Home
          </Button>
        </div>
      </section>
    </main>
  );
}
