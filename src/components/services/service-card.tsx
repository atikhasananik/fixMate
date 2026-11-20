import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Home,
  MapPin,
  Store,
  UserRound,
  Wrench,
} from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { ServiceCardProps, ServiceMode } from "@/types/type";

const MODE_LABELS: Record<ServiceMode, string> = {
  "home-visit": "Home visit",
  "shop-drop-off": "Shop drop-off",
};

const MODE_ICONS: Record<ServiceMode, typeof Home> = {
  "home-visit": Home,
  "shop-drop-off": Store,
};

export function ServiceCard({ service }: ServiceCardProps) {
  const ModeIcon = MODE_ICONS[service.serviceMode];
  const available = service.isAvailable;

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 ring-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:hover:border-blue-900/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-900">
        {service.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- ImgBB URLs bypass next/image optimization
          <img
            src={service.image}
            alt={`${service.title || "Service"} preview`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span
            className="flex size-full items-center justify-center text-blue-600 dark:text-blue-300"
            aria-hidden="true"
          >
            <Wrench className="size-8" />
          </span>
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className="bg-background/90 backdrop-blur-sm dark:bg-background/80"
          >
            {service.category || "Service"}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "gap-1.5 backdrop-blur-sm",
              available
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/80 dark:text-emerald-300"
                : "border-rose-200 bg-rose-50/95 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/80 dark:text-rose-300"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                available ? "bg-emerald-500" : "bg-rose-500"
              )}
              aria-hidden="true"
            />
            {available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      <CardHeader className="gap-2 px-4 pt-4">
        <CardTitle className="line-clamp-2 min-h-12 text-lg font-semibold leading-6">
          {service.title || "Untitled service"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-3 pb-4">
        <div className="flex min-h-7 flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1.5 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
          >
            <ModeIcon className="size-3.5" aria-hidden="true" />
            {MODE_LABELS[service.serviceMode]}
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" aria-hidden="true" />
            {service.estimatedDuration || "Duration on request"}
          </span>
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {service.serviceArea || "Service area not specified"}
            </span>
          </span>
          <span className="inline-flex min-w-0 items-center gap-2">
            <UserRound className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {service.technicianName || "Technician details unavailable"}
            </span>
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/60 pt-3">
          <div>
            <span className="text-xs text-muted-foreground">Starting at</span>
            <p className="text-xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(service.basePrice)}
            </p>
          </div>
        </div>

        <Button
          render={<Link href={`/services/${service.id}`} />}
          className="h-10 w-full justify-between rounded-xl bg-blue-600 px-4 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
        >
          <span className="inline-flex items-center gap-2">
            <Wrench className="size-4" aria-hidden="true" />
            View Details
          </span>
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Button>
      </CardContent>
    </Card>
  );
}
