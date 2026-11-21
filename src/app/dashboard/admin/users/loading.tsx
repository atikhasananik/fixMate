import { Skeleton } from "@/components/ui/skeleton";

/**
 * Mirrors the users page: table rows on tablet and desktop, stacked cards on
 * mobile, so the layout keeps its shape while the backend responds. This route
 * has no filter/input to unmount, so a route-level boundary is safe here.
 */
export default function AdminUsersLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-4 sm:px-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </div>

        {/* Mobile: card skeletons. */}
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 md:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-xl border border-border/70 p-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 max-w-full" />
                  <Skeleton className="h-3 w-40 max-w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & desktop: table row skeletons. */}
        <div className="hidden divide-y divide-border/60 md:block">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-4 py-4 sm:px-6"
            >
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="ml-auto h-8 w-36 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
