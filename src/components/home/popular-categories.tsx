import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PopularCategoriesProps } from "@/types/type";

export function PopularCategories({
  eyebrow,
  title,
  description,
  categories,
  className,
}: PopularCategoriesProps) {
  return (
    <section
      aria-labelledby="popular-categories-heading"
      className={cn(
        "border-t border-border/60 bg-background",
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <Badge
              variant="outline"
              className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
            >
              <LayoutGrid className="size-3" aria-hidden="true" />
              {eyebrow}
            </Badge>
          ) : null}

          <h2
            id="popular-categories-heading"
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
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <li key={category.slug}>
                <Link
                  href={`/services?category=${category.slug}`}
                  className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Card className="h-full border border-border/70 ring-0 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-200 group-hover:shadow-md dark:group-hover:border-blue-900/70">
                    <CardHeader>
                      <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>

                      <CardTitle className="mt-1">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>

                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                        View services
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
