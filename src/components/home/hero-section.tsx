import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/home/hero-visual";
import type { HeroSectionProps } from "@/types/type";

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  image,
  highlights,
  className,
}: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(
        "relative overflow-hidden border-b border-border/60 bg-background",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -right-40 bottom-0 size-[28rem] rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          {eyebrow ? (
            <Badge
              variant="outline"
              className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
            >
              <Sparkles className="size-3" aria-hidden="true" />
              {eyebrow}
            </Badge>
          ) : null}

          <h1
            id="hero-heading"
            className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={primaryAction.href} />}
              className="h-11 rounded-xl bg-blue-600 px-5 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
            >
              {primaryAction.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>

            {secondaryAction ? (
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<Link href={secondaryAction.href} />}
                className="h-11 rounded-xl px-5"
              >
                {secondaryAction.label}
              </Button>
            ) : null}
          </div>

          {highlights?.length ? (
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5 text-sm text-muted-foreground">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-1.5">
                  <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Check className="size-2.5" aria-hidden="true" />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <HeroVisual src={image.src} alt={image.alt} />
      </div>
    </section>
  );
}
