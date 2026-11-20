import type {
  ServiceApiItem,
  ServiceMode,
  TechnicianService,
} from "@/types/type";

/** Maps the API label ("Home Visit" / "Shop Drop-off") to the form value. */
export function toServiceMode(label: string | undefined): ServiceMode {
  return label === "Shop Drop-off" ? "shop-drop-off" : "home-visit";
}

/** Normalises a raw API document into the shape the UI renders. */
export function toTechnicianService(item: ServiceApiItem): TechnicianService {
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
    technicianName: item.technicianName,
    approvalStatus: item.approvalStatus ?? "pending",
    isAvailable: item.isAvailable ?? false,
  };
}
