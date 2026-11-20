import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ServiceDetails } from "@/types/type";

type ServiceDetailsHeaderProps = Pick<ServiceDetails, "service">;

export function ServiceDetailsHeader({
  service,
}: ServiceDetailsHeaderProps) {
  return (
    <header className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight aria-hidden="true" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/services" />}>
              Services
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight aria-hidden="true" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{service.title || "Service details"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
            >
              {service.category || "Repair service"}
            </Badge>
            <Badge
              variant="outline"
              className={
                service.isAvailable
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/60 dark:text-rose-300"
              }
            >
              {service.isAvailable ? "Available" : "Currently unavailable"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {service.title || "Untitled service"}
          </h1>
        </div>
      </div>
    </header>
  );
}
