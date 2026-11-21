import { Skeleton } from "@/components/ui/skeleton";

/**
 * Sized to the users table so the page keeps its shape while the backend
 * responds. This route has no filter/input to unmount, so a route-level
 * boundary is safe here.
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

        <div className="divide-y divide-border/60">
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
