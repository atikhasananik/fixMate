import type { LucideIcon } from "lucide-react";
import { Workflow } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";

import StepCard, { HowItWorksStep } from "./stepCard";



type HowItWorksProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  steps: HowItWorksStep[];
  className?: string;
};

export function HowItWorks({
  eyebrow,
  title,
  description,
  steps,
  className,
}: HowItWorksProps) {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className={cn("bg-background", className)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <Badge
              variant="outline"
              className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
            >
              <Workflow className="size-3" aria-hidden="true" />
              {eyebrow}
            </Badge>
          ) : null}

          <h2
            id="how-it-works-heading"
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

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <StepCard step={step} index={index} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

