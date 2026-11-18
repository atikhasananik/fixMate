import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { isGoogleAuthEnabled } from "@/lib/auth-providers";
import { sanitizeRedirectPath } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const params = await searchParams;

  return (
    <SignInForm
      redirectTo={sanitizeRedirectPath(params.redirect)}
      googleEnabled={isGoogleAuthEnabled()}
    />
  );
}
