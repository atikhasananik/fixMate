"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { signOut } from "@/lib/auth-client";

/** Sign out of BetterAuth, then return to the public site. */
export function useSignOut() {
  const router = useRouter();

  return async function handleSignOut() {
    const { error } = await signOut();

    if (error) {
      toast.add({
        type: "error",
        title: "Couldn't sign out",
        description: error.message ?? "Please try again.",
      });
      return;
    }

    router.push("/");
    router.refresh();
  };
}
