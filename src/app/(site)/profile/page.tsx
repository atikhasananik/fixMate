import { redirect } from "next/navigation";

/** The shared profile now lives inside the dashboard shell. */
export default function ProfileRedirectPage() {
  redirect("/dashboard/profile");
}
