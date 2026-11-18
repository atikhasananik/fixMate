import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <PagePlaceholder
      title="Sign In"
      description="Authentication is being connected. This page will host the FixMate sign-in form."
    />
  );
}
