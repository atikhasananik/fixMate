import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-9 w-80 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
      </div>

      <Skeleton className="mt-8 h-28 w-full rounded-2xl" />

      <Skeleton className="mt-6 h-4 w-32" />

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
          >
            <Skeleton className="aspect-16/10 w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
