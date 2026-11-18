import { cn } from "cn";
import { Card, CardHeader } from "@/components/ui/card";
import type { StatCardProps, StatsGridProps } from "@/types/type";

export function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <Card className="border border-border/70 ring-0 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {stat.value}
          </p>
          {stat.hint ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {stat.hint}
            </p>
          ) : null}
        </div>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardHeader>
    </Card>
  );
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
