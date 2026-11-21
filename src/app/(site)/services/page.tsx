import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Search, Sparkles, TriangleAlert, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { ServiceCard } from "@/components/services/service-card";
import { ServicesToolbar } from "@/components/services/services-toolbar";
import { getAllServiceData } from "@/lib/Action/api/get.data.api";
import { toTechnicianService } from "@/lib/service-mappers";
import {
  buildServiceApiQuery,
  hasActiveServiceFilters,
} from "@/lib/services-query";
import type { ServiceApiItem } from "@/types/type";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse repair services from verified FixMate technicians, compare prices and availability, then book the repair that fits your day.",
};

type ServiceSearchParams = Awaited<PageProps<"/services">["searchParams"]>;

export default async function ServicesPage({
  searchParams,
}: PageProps<"/services">) {
  const params = await searchParams;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-2xl">
        <Badge
          variant="outline"
          className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
        >
          <Sparkles className="size-3" aria-hidden="true" />
          Browse services
        </Badge>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Repair services, ready when you are
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Compare prices, service modes, and availability from verified
          technicians — then book the repair that fits your day.
        </p>
      </header>

      {/*
        The toolbar sits outside the Suspense boundary so it (and the search
        box's focus and text) survives every backend-driven search navigation.
      */}
      <div className="mt-8">
        <ServicesToolbar searchParams={params} />
      </div>

      <Suspense fallback={<ServicesResultsSkeleton />}>
        <ServicesResults params={params} />
      </Suspense>
    </section>
  );
}

async function ServicesResults({ params }: { params: ServiceSearchParams }) {
  // The backend owns search, filtering and sorting; it receives the URL params.
  const apiQuery = buildServiceApiQuery(params);

  let services: ServiceApiItem[] = [];
  let error: string | null = null;

  try {
    services = await getAllServiceData(apiQuery);
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load services. Please try again.";
  }

  const hasFilters = hasActiveServiceFilters(params);
  const countLabel = `${services.length} ${services.length === 1 ? "service" : "services"}`;

  return (
    <div className="mt-6">
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {error ? "Services couldn't be loaded." : countLabel}
      </p>

      <div className="mt-4">
        {error ? (
          <EmptyState
            icon={TriangleAlert}
            title="Couldn't load services"
            description={error}
          >
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/services" />}
              className="mt-2"
            >
              Try again
            </Button>
          </EmptyState>
        ) : services.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon={Search}
              title="No matching services found"
              description="Try changing or clearing your search and filters to find more repair services."
            />
          ) : (
            <EmptyState
              icon={Wrench}
              title="No services available yet"
              description="Verified technicians are still preparing their listings. Check back soon."
            />
          )
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service._id} className="h-full">
                <ServiceCard service={toTechnicianService(service)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


// here is loading fallback 
function ServicesResultsSkeleton() {
  return (
    <div className="mt-6" aria-hidden="true">
      <Skeleton className="h-4 w-24" />

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
          >
            <Skeleton className="aspect-16/10 w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
