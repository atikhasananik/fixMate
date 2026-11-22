"use client";

import Link from "next/link";
import { CircleAlert, House, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  function reset() {
    retry();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl rounded-2xl border-border/70 py-8 shadow-sm sm:py-10">
        <CardHeader className="items-center gap-5 px-6 text-center sm:px-10">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/15 bg-destructive/5 text-destructive">
            <CircleAlert className="size-7" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">
            Something Went Wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-6 text-center sm:px-10">
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            An unexpected error occurred. Please try again. If the problem
            continues, contact our support team.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={reset}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RotateCcw aria-hidden="true" />
              Try Again
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/" />}
              variant="outline"
            >
              <House aria-hidden="true" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
