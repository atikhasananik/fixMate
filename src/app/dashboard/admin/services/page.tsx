import type { Metadata } from "next";
import { AdminServices } from "@/components/dashboard/admin/admin-services";
import { getAdminServiceData } from "@/lib/Action/api/get.data.api";
import { buildAdminServicesApiQuery } from "@/lib/admin-services-query";
import { toTechnicianService } from "@/lib/service-mappers";
import type { TechnicianService } from "@/types/type";

export const metadata: Metadata = {
  title: "Service Approval",
};

export default async function AdminServicesPage({
  searchParams,
}: PageProps<"/dashboard/admin/services">) {
  const params = await searchParams;

  let services: TechnicianService[] = [];
  let error: string | null = null;

  try {
    // The backend owns filtering and sorting; the URL params are forwarded.
    const items = await getAdminServiceData(buildAdminServicesApiQuery(params));
    services = items.map(toTechnicianService);
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load services. Please try again.";
  }

  return (
    <AdminServices services={services} error={error} searchParams={params} />
  );
}
