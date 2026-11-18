import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <PagePlaceholder
      title="Create an Account"
      description="Authentication is being connected. This page will host the FixMate registration form for customers and technicians."
    />
  );
}
