import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicianServicesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/60 px-4 py-4 sm:px-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full" />
        </div>

        <div className="divide-y divide-border/60">
          <div className="flex items-center gap-3 bg-muted/40 px-4 py-3 sm:px-6">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 w-16 md:block" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-4 sm:px-6"
            >
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="hidden h-4 w-16 md:block" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
