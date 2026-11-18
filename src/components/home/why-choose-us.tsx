import { ShieldCheck } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WhyChooseUsProps } from "@/types/type";

export function WhyChooseUs({
  eyebrow,
  title,
  description,
  points,
  className,
}: WhyChooseUsProps) {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className={cn("bg-background", className)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <Badge
              variant="outline"
              className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
            >
              <ShieldCheck className="size-3" aria-hidden="true" />
              {eyebrow}
            </Badge>
          ) : null}

          <h2
            id="why-choose-us-heading"
            className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {title}
          </h2>

          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {points.map((point) => {
            const Icon = point.icon;

            return (
              <li key={point.title}>
                <Card className="h-full border border-border/70 ring-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:hover:border-blue-900/70">
                  <CardHeader>
                    <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>

                    <CardTitle className="mt-1">{point.title}</CardTitle>
                    <CardDescription>{point.description}</CardDescription>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
