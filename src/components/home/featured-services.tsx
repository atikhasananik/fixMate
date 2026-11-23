import { Suspense } from "react";
import Link from "next/link";
import { Sparkles, TriangleAlert, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { FeaturedServicesSkeleton } from "@/components/home/featured-services-skeleton";
import { ServiceCard } from "@/components/services/service-card";
import { getFeaturedServiceData } from "@/lib/Action/api/public/get";
import { toTechnicianService } from "@/lib/service-mappers";
import type { ServiceApiItem } from "@/types/type";

/**
 * Homepage section that shows the six newest approved + available services.
 * The Suspense boundary keeps the skeleton on screen while the API responds.
 */
export function FeaturedServices() {
  return (
    <Suspense fallback={<FeaturedServicesSkeleton />}>
      <FeaturedServicesContent />
    </Suspense>
  );
}

async function FeaturedServicesContent() {
  let services: ServiceApiItem[] = [];
  let error: string | null = null;

  try {
    // The backend owns the filter, the newest-first ordering and the limit.
    services = await getFeaturedServiceData();
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load featured services. Please try again.";
  }

  return (
    <section
      aria-labelledby="featured-services-heading"
      className="bg-background"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
          >
            <Sparkles className="size-3" aria-hidden="true" />
            Featured services
          </Badge>

          <h2
            id="featured-services-heading"
            className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Recently added repairs
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The newest approved services from verified FixMate technicians,
            with upfront pricing and current availability.
          </p>
        </div>

        <div className="mt-12 lg:mt-16">
          {error ? (
            <EmptyState
              icon={TriangleAlert}
              title="Couldn't load featured services"
              description={error}
            >
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/services" />}
                className="mt-2"
              >
                Browse all services
              </Button>
            </EmptyState>
          ) : services.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No featured services yet"
              description="Approved services from verified technicians will appear here as soon as they are available."
            >
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/services" />}
                className="mt-2"
              >
                Browse all services
              </Button>
            </EmptyState>
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
    </section>
  );
}
