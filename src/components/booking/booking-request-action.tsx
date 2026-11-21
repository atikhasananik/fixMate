"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingRequestDialog } from "@/components/booking/booking-request-dialog";
import { ServiceDetails } from "@/types/type";
import { authClient } from "@/lib/auth-client";

type BookingRequestActionProps = {
  service : ServiceDetails
};

export function BookingRequestAction({ service } : BookingRequestActionProps) {
  const [open, setOpen] = useState(false);

 

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-11 w-full justify-between rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700"
      >
        Request Repair
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Button>
      <BookingRequestDialog
    service ={service}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
