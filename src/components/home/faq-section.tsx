import { CircleHelp } from "lucide-react";
import { cn } from "cn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { FaqSectionProps } from "@/types/type";

export function FaqSection({
  eyebrow,
  title,
  description,
  items,
  className,
}: FaqSectionProps) {
  return (
    <section
      aria-labelledby="faq-heading"
      className={cn("bg-background", className)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <Badge
              variant="outline"
              className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
            >
              <CircleHelp className="size-3" aria-hidden="true" />
              {eyebrow}
            </Badge>
          ) : null}

          <h2
            id="faq-heading"
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

        {/* Base UI closes the previous item when another opens by default. */}
        <Accordion className="mt-12 rounded-2xl border border-border/70 bg-card px-5 shadow-sm sm:px-7 lg:mt-16">
          {items.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-border/60"
            >
              <AccordionTrigger className="py-5 text-base font-medium data-[panel-open]:text-blue-600 dark:data-[panel-open]:text-blue-400">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
