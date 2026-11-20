import type { Metadata } from "next";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ServiceBookingCard } from "@/components/services/service-booking-card";
import { ServiceDetailsHeader } from "@/components/services/service-details-header";
import { ServiceInformation } from "@/components/services/service-information";
import { TechnicianCard } from "@/components/services/technician-card";
import { getSingleServiceData } from "@/lib/Action/api/get.data.api";
import { toServiceDetails } from "@/lib/service-mappers";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Service Details",
  description:
    "Explore repair service details, technician information, pricing, and booking availability.",
};

export default async function ServiceDetailsPage({
  params,
}: PageProps<"/services/[id]">) {
  const { id } = await params;

  let item;
  try {
    item = await getSingleServiceData(id)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Couldn't load this service. Please try again.";

    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>We couldn&apos;t load this service</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Button
          render={<Link href="/services" />}
          variant="outline"
          className="mt-5"
        >
          Browse services
        </Button>
      </section>
    );
  }

//   const item = items.find((service) => service._id === id);

  if (!item) {
    notFound();
  }

  const services = toServiceDetails(item);
  const { service, technician } = services

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <ServiceDetailsHeader service={service} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:items-start">
        <div className="space-y-8">
          <ServiceInformation service={service} />
          <TechnicianCard technician={technician} />
        </div>

        <aside className="lg:sticky lg:top-6">
          <ServiceBookingCard service={services} />
        </aside>
      </div>
    </section>
  );
}
