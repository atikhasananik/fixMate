import type { Metadata } from "next";
import { TechnicianServices } from "@/components/dashboard/technician/technician-services";
import { getServiceData } from "@/lib/Action/api/get.data.api";
import { getDashboardSession } from "@/lib/dashboard-session";
import { toTechnicianService } from "@/lib/service-mappers";
import type { TechnicianService } from "@/types/type";

export const metadata: Metadata = {
  title: "My Services",
};

export default async function TechnicianServicesPage() {
  const session = await getDashboardSession();

  let services: TechnicianService[] = [];
  let error: string | null = null;

  try {
    const items = await getServiceData(session.user.email);
    services = items.map(toTechnicianService);
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load your services. Please try again.";
  }

  return <TechnicianServices services={services} error={error} />;
}
