import Link from "next/link";
import { Wrench } from "lucide-react";
import { cn } from "cn";
import type { BrandProps } from "@/types/type";

export function Brand({ className, onClick }: BrandProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "group flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-colors duration-300 group-hover:bg-blue-700 dark:bg-blue-500 dark:group-hover:bg-blue-400">
        <Wrench className="size-5" aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Fix<span className="text-blue-600 dark:text-blue-400">Mate</span>
      </span>
    </Link>
  );
}
