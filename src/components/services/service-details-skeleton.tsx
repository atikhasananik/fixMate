import { Skeleton } from "@/components/ui/skeleton";

export function ServiceDetailsSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-6 h-9 w-2/3 max-w-xl" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(18rem,3fr)]">
        <div className="space-y-6">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="space-y-4 rounded-2xl border border-border/70 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-px w-full" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-border/70 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-14 w-64" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <aside>
          <div className="space-y-5 rounded-2xl border border-border/70 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </aside>
      </div>
    </section>
  );
}
