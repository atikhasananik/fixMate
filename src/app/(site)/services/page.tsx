import type { Metadata } from "next";
import Link from "next/link";
import { Search, Sparkles, TriangleAlert, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { ServiceCard } from "@/components/services/service-card";
import { ServicesToolbar } from "@/components/services/services-toolbar";
import { getAllServiceData } from "@/lib/Action/api/get.data.api";
import { toTechnicianService } from "@/lib/service-mappers";
import { readServiceParam } from "@/lib/services-query";
import type { ServiceApiItem } from "@/types/type";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse repair services from verified FixMate technicians, compare prices and availability, then book the repair that fits your day.",
};

export default async function ServicesPage({
  searchParams,
}: PageProps<"/services">) {
  const params = await searchParams;

  let services: ServiceApiItem[] = [];
  let error: string | null = null;

  try {
    services = await getAllServiceData();
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load services. Please try again.";
  }

  const categories = Array.from(
    new Set(
      services
        .map((service) => service.category)
        .filter((category): category is string => Boolean(category))
    )
  ).sort((a, b) => a.localeCompare(b));

  const search = readServiceParam(params, "search").trim().toLocaleLowerCase();
  const category = readServiceParam(params, "category");
  const mode = readServiceParam(params, "mode");
  const availability = readServiceParam(params, "availability");
  const sort = readServiceParam(params, "sort");

  const matchingServices = services.filter((service) => {
    const matchesSearch =
      !search ||
      `${service.title ?? ""} ${service.category ?? ""}`
        .toLocaleLowerCase()
        .includes(search);
    const matchesCategory = !category || service.category === category;
    const matchesMode =
      !mode || toTechnicianService(service).serviceMode === mode;
    const matchesAvailability =
      !availability ||
      (availability === "available" && Boolean(service.isAvailable)) ||
      (availability === "unavailable" && !service.isAvailable);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMode &&
      matchesAvailability
    );
  });

  if (sort === "oldest") {
    matchingServices.sort(
      (a, b) =>
        new Date(a.createdAt ?? 0).getTime() -
        new Date(b.createdAt ?? 0).getTime()
    );
  } else if (sort === "price-asc") {
    matchingServices.sort(
      (a, b) => Number(a.basePrice ?? 0) - Number(b.basePrice ?? 0)
    );
  } else if (sort === "price-desc") {
    matchingServices.sort(
      (a, b) => Number(b.basePrice ?? 0) - Number(a.basePrice ?? 0)
    );
  } else if (sort === "title-asc") {
    matchingServices.sort((a, b) =>
      (a.title ?? "").localeCompare(b.title ?? "")
    );
  } else {
    matchingServices.sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );
  }

  const countLabel = `${matchingServices.length} ${matchingServices.length === 1 ? "service" : "services"}`;

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

      {error ? null : (
        <div className="mt-8">
          <ServicesToolbar categories={categories} searchParams={params} />
        </div>
      )}

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
          ) : matchingServices.length === 0 ? (
            <EmptyState
              icon={services.length === 0 ? Wrench : Search}
              title={
                services.length === 0
                  ? "No services available yet"
                  : "No matching services found"
              }
              description={
                services.length === 0
                  ? "Verified technicians are still preparing their listings. Check back soon."
                  : "Try changing or clearing your search and filters to find more repair services."
              }
            />
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matchingServices.map((service) => (
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
