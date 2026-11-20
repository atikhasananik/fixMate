import type { DashboardViewer, UserRole } from "@/types/type";

export interface ProfileFormData {
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  area: string;
  bio: string;
  image: string;
}

export type EditableProfileField = "name" | "phone" | "area" | "bio";

export type ProfileUpdateData = {
  name: string;
  image?: string;
  phone?: number;
  area?: string;
  bio?: string;
};

export function getInitialProfileData(
  session: Pick<
    DashboardViewer,
    "name" | "email" | "role" | "phone" | "area" | "bio" | "image"
  >,
): ProfileFormData {
  return {
    name: session.name ?? "",
    email: session.email ?? "",
    role: session.role,
    phone: session.phone == null ? "" : String(session.phone),
    area: session.area ?? "",
    bio: session.bio ?? "",
    image: session.image ?? "",
  };
}

export function isEditableProfileField(
  field: string,
): field is EditableProfileField {
  return field === "name" || field === "phone" || field === "area" || field === "bio";
}

export function createProfileUpdateData(
  values: ProfileFormData,
  image = values.image,
): ProfileUpdateData {
  const phone = values.phone.trim();

  return {
    name: values.name.trim(),
    ...(image ? { image } : {}),
    ...(phone ? { phone: Number(phone) } : {}),
    ...(values.area.trim() ? { area: values.area.trim() } : {}),
    ...(values.bio.trim() ? { bio: values.bio.trim() } : {}),
  };
}
