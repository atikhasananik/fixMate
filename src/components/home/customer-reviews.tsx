import { MessageSquareQuote } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { ReviewCard } from "@/components/home/review-card";
import type { CustomerReviewsProps } from "@/types/type";

export function CustomerReviews({
  eyebrow,
  title,
  description,
  reviews,
  className,
}: CustomerReviewsProps) {
  return (
    <section
      aria-labelledby="customer-reviews-heading"
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
              <MessageSquareQuote className="size-3" aria-hidden="true" />
              {eyebrow}
            </Badge>
          ) : null}

          <h2
            id="customer-reviews-heading"
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

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <li
              key={`${review.name}-${review.service}`}
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 motion-reduce:animate-none"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
