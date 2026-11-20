"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { ServiceForm } from "@/components/dashboard/shared/service-form";
import { useDashboardStore } from "@/components/dashboard/shared/dashboard-store";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { buildServiceData } from "@/lib/service-payload";
import type { ServiceFormValues } from "@/types/type";
import { postServive } from "@/lib/Action/api/post.data.api";

export function AddService() {
  const router = useRouter();
  const { viewer, addService } = useDashboardStore();

 async function handleSubmit(values: ServiceFormValues) {
    // Form state → API body. Technician comes from the session, and the
    // approval/availability/createdAt defaults are set inside the builder.
    const data = buildServiceData(values, viewer);

    // addService(data);
    // console.log(data);

    // TODO: swap for the real API once the endpoint exists.
    // const servicePostResult = await fetch("/api/services", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });

    const servicePostResult = await postServive(data)
    console.log(servicePostResult);

    toast.add({
      type: "success",
      title: "Service submitted",
      description:
        "Your service is waiting for admin approval before it appears publicly.",
    });

    router.push("/dashboard/technician/my-services");
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full max-w-3xl">
        <PageHeader
          title="Add a Service"
          description="Create a repair listing. New and edited services are reviewed by an admin before going live."
        />
      </div>

      <Card className="mx-auto w-full max-w-3xl rounded-2xl border border-border/70 ring-0 shadow-sm [--card-spacing:1.5rem]">
        <CardContent>
          <ServiceForm
            technician={{ name: viewer.name, email: viewer.email }}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
