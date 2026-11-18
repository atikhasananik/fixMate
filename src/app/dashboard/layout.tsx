import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <>
      {/* <Navbar /> */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
}
