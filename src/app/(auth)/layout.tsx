import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* Soft brand glow behind the form */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
        <div className="absolute -right-24 -bottom-40 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-400/10" />
      </div>

      <header className="absolute inset-x-0 top-0 z-10 flex items-center px-4 py-4 sm:px-6">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
          className="rounded-full border-border/70 bg-background/70 px-4 shadow-sm backdrop-blur-md transition-colors hover:bg-background"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="sm:hidden">Home</span>
          <span className="hidden sm:inline">Back to home</span>
        </Button>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 py-24 sm:px-6">
        {children}
      </main>
    </div>
  );
}
