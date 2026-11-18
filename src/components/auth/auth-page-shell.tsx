import { CheckCircle2 } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { AuthPageShellProps } from "@/types/type";

const DEFAULT_HIGHLIGHTS = [
  "Verified technicians",
  "Upfront estimates",
  "Pay after service",
];

export function AuthPageShell({
  title,
  description,
  children,
  footer,
  highlights = DEFAULT_HIGHLIGHTS,
}: AuthPageShellProps) {
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center text-center">
        <Brand />

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <Card className="mt-8 w-full rounded-2xl border border-border/70 shadow-lg shadow-slate-900/5 [--card-spacing:1.5rem]">
        <CardContent>{children}</CardContent>
        <CardFooter className="justify-center gap-1 text-sm text-muted-foreground">
          {footer}
        </CardFooter>
      </Card>

      {highlights.length > 0 ? (
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-1.5">
              <CheckCircle2
                className="size-3.5 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
