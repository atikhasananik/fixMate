import type {
  IServiceData,
  ServiceFormValues,
  ServiceMode,
} from "@/types/type";

/** Stable form value → label shown on the `IServiceData` payload. */
export const SERVICE_MODE_LABEL_BY_VALUE: Record<
  ServiceMode,
  IServiceData["serviceMode"]
> = {
  "home-visit": "Home Visit",
  "shop-drop-off": "Shop Drop-off",
};

/** Payload label → stable value used by selects and the stored listing. */
export const SERVICE_MODE_VALUE_BY_LABEL: Record<
  IServiceData["serviceMode"],
  ServiceMode
> = {
  "Home Visit": "home-visit",
  "Shop Drop-off": "shop-drop-off",
};

/**
 * Turns raw form state into the exact body the add-service POST will send.
 * Technician identity comes from the session, and the three status fields are
 * fixed defaults, so the submit handler stays a one-liner.
 */
export function buildServiceData(
  values: ServiceFormValues,
  technician: { name: string; email: string }
): IServiceData {
  return {
    title: values.title.trim(),
    // validateServiceForm already checked it against SERVICE_CATEGORIES.
    category: values.category as IServiceData["category"],
    description: values.description.trim(),
    image: values.image,
    basePrice: Number(values.basePrice),
    estimatedDuration: values.estimatedDuration.trim(),
    serviceMode: SERVICE_MODE_LABEL_BY_VALUE[values.serviceMode],
    serviceArea: values.serviceArea.trim(),
    technicianName: technician.name,
    technicianEmail: technician.email,
    approvalStatus: "pending",
    isAvailable: true,
    createdAt: new Date(),
  };
}
