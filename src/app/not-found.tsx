"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, House, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  function handleGoBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl rounded-2xl border-border/70 py-8 shadow-sm sm:py-10">
        <CardHeader className="items-center gap-5 px-6 text-center sm:px-10">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
            <SearchX className="size-7" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="font-heading text-6xl font-bold tracking-tight text-primary sm:text-7xl">
              404
            </p>
            <CardTitle className="text-2xl sm:text-3xl">
              Page Not Found
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 text-center sm:px-10">
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist, may have been
            moved, or is temporarily unavailable.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              nativeButton={false}
              render={<Link href="/" />}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <House aria-hidden="true" />
              Back to Home
            </Button>
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft aria-hidden="true" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
