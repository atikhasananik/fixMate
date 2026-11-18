"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/dashboard/service-form";
import { useDashboardStore } from "@/components/dashboard/dashboard-store";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import type { ServiceFormValues } from "@/types/type";

export function AddService() {
  const router = useRouter();
  const { viewer, addService } = useDashboardStore();

  function handleSubmit(values: ServiceFormValues) {
    addService(values, { id: viewer.id, name: viewer.name });

    toast.add({
      type: "success",
      title: "Service submitted",
      description:
        "Your service is waiting for admin approval before it appears publicly.",
    });

    router.push("/dashboard/technician/my-services");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add a Service"
        description="Create a repair listing. New and edited services are reviewed by an admin before going live."
      />

      <Card className="max-w-3xl rounded-2xl border border-border/70 ring-0 shadow-sm [--card-spacing:1.5rem]">
        <CardContent>
          <ServiceForm
            mode="create"
            technician={{ name: viewer.name, email: viewer.email }}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
