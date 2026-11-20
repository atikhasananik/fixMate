import {
  Clock3,
  Home,
  MapPin,
  Store,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";
import type { ServiceDetails } from "@/types/type";

type ServiceInformationProps = Pick<ServiceDetails, "service">;

export function ServiceInformation({ service }: ServiceInformationProps) {
  const ModeIcon = service.serviceMode === "home-visit" ? Home : Store;
  const modeLabel =
    service.serviceMode === "home-visit" ? "Home visit" : "Shop drop-off";

  return (
    <div className="space-y-6">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm">
        {service.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- Service images are hosted on ImgBB.
          <img
            src={service.image}
            alt={`${service.title || "Repair service"} cover`}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted text-blue-700 dark:text-blue-300">
            <ModeIcon className="size-12" aria-hidden="true" />
          </div>
        )}
      </div>

      <Card className="gap-0 rounded-2xl border border-border/70 shadow-sm">
        <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="text-xl font-semibold">
            About this service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-5 pb-5 sm:px-6 sm:pb-6">
          <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
            {service.description || "No additional service description was provided."}
          </p>

          <Separator />

          <dl className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <Clock3 className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-medium text-muted-foreground">
                  Estimated duration
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {service.estimatedDuration || "To be confirmed"}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <ModeIcon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-medium text-muted-foreground">
                  Service mode
                </dt>
                <dd className="mt-1">
                  <Badge variant="outline">{modeLabel}</Badge>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-medium text-muted-foreground">
                  Service area
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {service.serviceArea || "Location not specified"}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <Wallet className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-medium text-muted-foreground">
                  Starting price
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {formatCurrency(service.basePrice)}
                </dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
