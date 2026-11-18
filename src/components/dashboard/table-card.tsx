import type { TableCardProps } from "@/types/type";
import { cn } from "cn";

/**
 * Card shell for dashboard tables: title row with an optional filter/action,
 * then a full-bleed table body.
 */
export function TableCard({
  title,
  description,
  action,
  children,
  className,
}: TableCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm",
        className
      )}
    >
      <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-medium text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {children}
    </div>
  );
}
