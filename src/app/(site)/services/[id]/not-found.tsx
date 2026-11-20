import Link from "next/link";
import { SearchX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Alert>
        <SearchX aria-hidden="true" />
        <AlertTitle>Service not found</AlertTitle>
        <AlertDescription>
          This service may have been removed or is no longer available.
        </AlertDescription>
      </Alert>
      <Button
        render={<Link href="/services" />}
        variant="outline"
        className="mt-5"
      >
        Browse services
      </Button>
    </section>
  );
}
