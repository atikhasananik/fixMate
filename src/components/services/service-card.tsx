import { Clock, Home, Store, Wrench } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { ServiceCardProps, ServiceMode } from "@/types/type";
import { Button } from "../ui/button";

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
    <Card className="group h-full gap-0 overflow-hidden border border-border/70 py-0 ring-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:hover:border-blue-900/70">
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
              "backdrop-blur-sm",
              available
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/80 dark:text-emerald-300"
                : "border-rose-200 bg-rose-50/95 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/80 dark:text-rose-300"
            )}
          >
            {available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      <CardHeader className="px-4 pt-4">
        <CardTitle className="line-clamp-2 leading-snug">
          {service.title || "Untitled service"}
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-auto flex flex-col gap-4 px-4 pt-3 pb-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ModeIcon className="size-4" aria-hidden="true" />
            {MODE_LABELS[service.serviceMode]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {service.estimatedDuration || "Duration on request"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/60 pt-3">
          <div>
            <span className="text-xs text-muted-foreground">Starting at</span>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrency(service.basePrice)}
            </p>
          </div>
          {service.serviceArea ? (
            <span className="max-w-32 truncate text-xs text-muted-foreground">
              {service.serviceArea}
            </span>
          ) : null}
        </div>
        <Button variant={"default"}> View Details </Button>
      </CardContent>
    </Card>
  );
}
