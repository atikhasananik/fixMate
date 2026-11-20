import type { Metadata } from "next";
import { TechnicianServices } from "@/components/dashboard/technician/technician-services";
import { getServiceData } from "@/lib/Action/api/get.data.api";
import { getDashboardSession } from "@/lib/dashboard-session";
import type {
  ServiceApiItem,
  ServiceMode,
  TechnicianService,
} from "@/types/type";

export const metadata: Metadata = {
  title: "My Services",
};

/** Maps the API label ("Home Visit" / "Shop Drop-off") to the form value. */
function toServiceMode(label: string | undefined): ServiceMode {
  return label === "Shop Drop-off" ? "shop-drop-off" : "home-visit";
}

function toTechnicianService(item: ServiceApiItem): TechnicianService {
  return {
    id: item._id,
    title: item.title ?? "",
    category: item.category ?? "",
    description: item.description ?? "",
    image: item.image || undefined,
    basePrice: Number(item.basePrice) || 0,
    estimatedDuration: item.estimatedDuration ?? "",
    serviceMode: toServiceMode(item.serviceMode),
    serviceArea: item.serviceArea ?? "",
    approvalStatus: item.approvalStatus ?? "pending",
    isAvailable: item.isAvailable ?? false,
  };
}

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
