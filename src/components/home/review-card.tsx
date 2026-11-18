import { BadgeCheck, Quote, Star } from "lucide-react";
import { cn } from "cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { getInitials } from "@/lib/nav";
import type { ReviewCardProps } from "@/types/type";

const MAX_RATING = 5;

export function ReviewCard({ review }: ReviewCardProps) {
  const rating = Math.min(Math.max(Math.round(review.rating), 0), MAX_RATING);

  return (
    <Card className="h-full border border-border/70 ring-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:hover:border-blue-900/70">
      <CardHeader className="gap-2">
        <CardAction>
          <Quote
            className="size-8 text-blue-600/10 dark:text-blue-400/10"
            aria-hidden="true"
          />
        </CardAction>

        <div
          role="img"
          aria-label={`Rated ${rating} out of ${MAX_RATING}`}
          className="flex items-center gap-0.5"
        >
          {Array.from({ length: MAX_RATING }, (_, starIndex) => (
            <Star
              key={starIndex}
              aria-hidden="true"
              className={cn(
                "size-4",
                starIndex < rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5">
        <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
          “{review.quote}”
        </blockquote>

        <div className="flex items-center gap-3 border-t border-border/60 pt-4">
          <Avatar>
            <AvatarFallback>{getInitials(review.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {review.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {review.service}
            </p>
          </div>

          {review.verified ? (
            <span className="ml-auto shrink-0 text-blue-600 dark:text-blue-400">
              <BadgeCheck className="size-4" aria-hidden="true" />
              <span className="sr-only">Verified customer</span>
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
