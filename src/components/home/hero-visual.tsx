import Image from "next/image";
import { BadgeCheck, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { HeroVisualProps } from "@/types/type";

// DaisyUI's `hover-3d` uses eight transparent siblings as a 3x3 hover map
// around the first child (the center cell is intentionally left empty).
const HOVER_ZONES = 8;

export function HeroVisual({ src, alt }: HeroVisualProps) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mr-0 lg:ml-auto">
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10"
      />
      <div
        aria-hidden="true"
        className="absolute -top-5 -right-5 -z-10 size-36 rounded-full border border-blue-200/70 bg-blue-100/60 dark:border-blue-900/60 dark:bg-blue-950/40"
      />

      <div className="hover-3d w-full">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl shadow-slate-950/10 dark:shadow-black/40">
          <div className="relative aspect-[4/5]">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 70vw, 90vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent"
            />
          </div>
        </div>

        {Array.from({ length: HOVER_ZONES }, (_, index) => (
          <div key={index} aria-hidden="true" />
        ))}
      </div>

      <Card
        size="sm"
        className="absolute top-4 left-4 w-[10.5rem] border border-white/60 bg-white/90 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90"
      >
        <CardContent className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300">
            <BadgeCheck className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">
              Verified Technician
            </p>
            <p className="text-[11px] text-muted-foreground">
              Background checked
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="absolute right-4 bottom-4 w-[10.5rem] border border-white/60 bg-white/90 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90"
      >
        <CardContent className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-300">
            <Wallet className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">
              Pay after service
            </p>
            <p className="text-[11px] text-muted-foreground">
              No upfront payment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
