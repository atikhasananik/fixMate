import Link from "next/link";
import { Clock3, Home, Store } from "lucide-react";
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
import { BookingRequestAction } from "@/components/booking/booking-request-action";

type ServiceBookingCardProps = {
  service: ServiceDetails;
};

export async function ServiceBookingCard({
  service: service,
}: ServiceBookingCardProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user.role;
  const services = service.service

  const ModeIcon = services.serviceMode === "home-visit" ? Home : Store;
  const modeLabel =
    services.serviceMode === "home-visit" ? "Home visit" : "Shop drop-off";

    console.log(service);
  return (
    
    <Card className="gap-0 rounded-2xl border border-border/70 shadow-sm">
      <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-lg font-semibold">
          Book this service
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Book a trusted professional for your service needs.
        </p>
      </CardHeader>

      <CardContent className="space-y-5 px-5 sm:px-6">
        <div>
          <p className="text-sm text-muted-foreground">Starting at</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {formatCurrency(services.basePrice)}
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
              {services.estimatedDuration || "To be confirmed"}
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

        {!services.isAvailable ? (
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
          services.isAvailable ? (
            <BookingRequestAction service={service} />
          ) : (
            <Button disabled className="h-11 w-full rounded-xl">
              Service unavailable
            </Button>
          )
        ) : role ? (
          <Alert>
            <AlertTitle>Only customers can request a repair</AlertTitle>
            <AlertDescription>
              Sign in with a customer account to request this service.
            </AlertDescription>
          </Alert>
        ) : (
          <Button
            render={
              <Link
                href={`/sign-in?redirect=${encodeURIComponent(`/services/${services.id}`)}`}
              />
            }
            className="h-11 w-full justify-between rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700"
          >
            Sign in to request a repair
            <span aria-hidden="true">→</span>
          </Button>
        )}
        <p className="text-center text-xs leading-5 text-muted-foreground">
          {role === "customer"
            ? "You can review your request before submitting."
            : "Request a repair from a trusted FixMate professional."}
        </p>
      </CardFooter>
    </Card>
  );
}
