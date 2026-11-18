import { Wrench } from "lucide-react";
import { cn } from "cn";
import type { ServiceCellProps, ServiceThumbnailProps } from "@/types/type";

/**
 * Image thumbnail with an icon fallback. Service images are optional until
 * ImgBB uploads are connected, so most sample rows use the fallback tile.
 */
export function ServiceThumbnail({
  title,
  image,
  className,
}: ServiceThumbnailProps) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-slate-50 text-blue-600 dark:bg-slate-900 dark:text-blue-300",
        className
      )}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- data URLs bypass next/image optimization
        <img
          src={image}
          alt={`${title} service`}
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        <Wrench className="size-4" aria-hidden="true" />
      )}
    </span>
  );
}

export function ServiceCell({ title, category, image }: ServiceCellProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ServiceThumbnail title={title} image={image} />
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{category}</p>
      </div>
    </div>
  );
}
