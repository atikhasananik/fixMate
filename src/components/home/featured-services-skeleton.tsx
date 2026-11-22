import { Skeleton } from "@/components/ui/skeleton";

/**
 * Placeholder for the Featured Services section. Its header and card boxes use
 * the same spacing and aspect ratio as the real section, so nothing shifts when
 * the backend response arrives.
 */
export function FeaturedServicesSkeleton() {
  return (
    <section
      aria-hidden="true"
      aria-busy="true"
      className="bg-background"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <Skeleton className="h-6 w-36 rounded-4xl" />
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
            >
              <Skeleton className="aspect-16/10 w-full rounded-none" />

              <div className="space-y-3 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-28 rounded-4xl" />
                <Skeleton className="h-4 w-40" />
                <div className="border-t border-border/60 pt-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-2 h-6 w-24" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
