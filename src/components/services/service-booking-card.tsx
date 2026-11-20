import Link from "next/link";
import { ArrowUpRight, Clock3, Home, Store } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";
import type { ServiceDetails } from "@/types/type";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type ServiceBookingCardProps = Pick<ServiceDetails, "service">;

export async function ServiceBookingCard({ service }: ServiceBookingCardProps) {

  const data = await auth.api.getSession({headers: await headers()})

  const role = data?.user.role

  const ModeIcon = service.serviceMode === "home-visit" ? Home : Store;
  const modeLabel =
    service.serviceMode === "home-visit" ? "Home visit" : "Shop drop-off";
  // const bookingHref = `/dashboard/customer/bookings?serviceId=${encodeURIComponent(service.id)}`;

  return (
    <Card className="gap-0 rounded-2xl border border-border/70 shadow-sm">
      <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-lg font-semibold">Book this service</CardTitle>
        <p className="text-sm text-muted-foreground">
          Book a trusted professional for your service needs.
        </p>
      </CardHeader>

      <CardContent className="space-y-5 px-5 sm:px-6">
        <div>
          <p className="text-sm text-muted-foreground">Starting at</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {formatCurrency(service.basePrice)}
          </p>
        </div>

        <Separator />

        <dl className="space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <dt className="inline-flex items-center gap-2 text-muted-foreground">
              <Clock3 className="size-4" aria-hidden="true" />
              Estimated duration
            </dt>
            <dd className="text-right font-medium text-foreground">
              {service.estimatedDuration || "To be confirmed"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <dt className="inline-flex items-center gap-2 text-muted-foreground">
              <ModeIcon className="size-4" aria-hidden="true" />
              Service mode
            </dt>
            <dd className="text-right font-medium text-foreground">
              {modeLabel}
            </dd>
          </div>
        </dl>

        {!service.isAvailable ? (
          <Alert>
            <AlertTitle>Currently unavailable</AlertTitle>
            <AlertDescription>
              This technician is not accepting requests for this service right
              now.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
        {role === "customer" ? (
          <Button
            // render={<Link href={bookingHref} />}
            className="h-11 w-full justify-between rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700"
          >
            Book This Service
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button disabled className="h-11 w-full rounded-xl">
            Only available for Customer
          </Button>
        )}
        <p className="text-center text-xs leading-5 text-muted-foreground">
          You can review your service request before confirming.
        </p>
      </CardFooter>
    </Card>
  );
}
