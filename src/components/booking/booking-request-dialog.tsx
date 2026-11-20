"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createBookingRequest } from "@/lib/Action/api/post.booking.api";
import {
  getTodayDateInputValue,
  isValidBookingRequest,
  validateBookingRequest,
  type BookingRequestErrors,
  type BookingRequestValues,
} from "@/lib/booking-validation";
import { BookingPayload, ServiceDetails } from "@/types/type";
import { useSession } from "@/lib/auth-client";
import { TechnicianCard } from "../services/technician-card";

type BookingRequestDialogProps = {
  service: ServiceDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_VALUES: BookingRequestValues = {
  phone: "",
  address: "",
  preferredDate: "",
  problemDescription: "",
};

export function BookingRequestDialog({
  service,
  open,
  onOpenChange,
}: BookingRequestDialogProps) {
  const router = useRouter();
  const [values, setValues] = useState<BookingRequestValues>(() => ({
    ...EMPTY_VALUES,
  }));
  const [errors, setErrors] = useState<BookingRequestErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = getTodayDateInputValue();

  const { data: session } = useSession();
  const customerName = session?.user.name || "";
  const customerEmail = session?.user.email || "";

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    if (!nextOpen) {
      setValues({
        ...EMPTY_VALUES,
      });
      setErrors({});
    }

    onOpenChange(nextOpen);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.currentTarget;

    if (
      name !== "phone" &&
      name !== "address" &&
      name !== "preferredDate" &&
      name !== "problemDescription"
    ) {
      return;
    }

    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateBookingRequest(values, today);
    setErrors(nextErrors);

    if (!customerName.trim() || !customerEmail.trim()) {
      toast.add({
        type: "error",
        title: "Customer information unavailable",
        description: "Refresh the page and sign in again before requesting.",
      });
      return;
    }

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerEmail,
      customerName,
      technicianEmail: service.technician.email,
      technicianName: service.technician.name,
      status: "requested",
      paymentStatus: "unpaid",
      serviceId: service.service.id,
      serviceTitle: service.service.title,
      serviceImage: service.service.image,
      category: service.service.category,
      basePrice: service.service.basePrice,
      finalAmount: 0,
      problemDescription: values.problemDescription,
      preferredDate: values.preferredDate,
      customerPhone: values.phone,
      address: values.address,
    } as BookingPayload

    console.log(payload);

    try {
      await createBookingRequest(payload);

      setValues({
        ...EMPTY_VALUES,
      });
      setErrors({});
      onOpenChange(false);
      toast.add({
        type: "success",
        title: "Repair request submitted",
        description: (
          <>
            Your repair request has been submitted successfully.{" "}
            <Link
              href="/dashboard/customer/bookings"
              className="font-medium text-blue-600 underline underline-offset-2 dark:text-blue-400"
            >
              View My Bookings
            </Link>
          </>
        ),
        timeout: 8000,
      });
      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Couldn't submit your request",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[min(92dvh,52rem)] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto p-0">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wrench className="size-5 text-blue-600" aria-hidden="true" />
              Request a Repair
            </DialogTitle>
            <DialogDescription>
              Provide a few details about your issue and we&apos;ll process your
              service request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            <section aria-labelledby="customer-info-heading">
              <h3
                id="customer-info-heading"
                className="mb-4 text-sm font-semibold text-foreground"
              >
                Customer information
              </h3>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="booking-customer-name">
                      <UserRound aria-hidden="true" />
                      Name
                    </FieldLabel>
                    <Input
                      id="booking-customer-name"
                      value={customerName}
                      readOnly
                      required
                      aria-readonly="true"
                      autoComplete="name"
                    />
                    {!customerName ? (
                      <FieldError>Name is required.</FieldError>
                    ) : null}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="booking-customer-email">
                      <Mail aria-hidden="true" />
                      Email
                    </FieldLabel>
                    <Input
                      id="booking-customer-email"
                      type="email"
                      value={customerEmail}
                      readOnly
                      required
                      aria-readonly="true"
                      autoComplete="email"
                    />
                    {!customerEmail ? (
                      <FieldError>Email is required.</FieldError>
                    ) : null}
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.phone)}>
                    <FieldLabel htmlFor="booking-phone">
                      <Phone aria-hidden="true" />
                      Phone number
                    </FieldLabel>
                    <Input
                      id="booking-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "booking-phone-error" : undefined
                      }
                      required
                      disabled={isSubmitting}
                    />
                    <FieldError id="booking-phone-error">
                      {errors.phone}
                    </FieldError>
                  </Field>

                  <Field data-invalid={Boolean(errors.address)}>
                    <FieldLabel htmlFor="booking-address">
                      <MapPin aria-hidden="true" />
                      Service address
                    </FieldLabel>
                    <Input
                      id="booking-address"
                      name="address"
                      autoComplete="street-address"
                      placeholder="Enter the address for this repair"
                      value={values.address}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.address)}
                      aria-describedby={
                        errors.address ? "booking-address-error" : undefined
                      }
                      required
                      disabled={isSubmitting}
                    />
                    <FieldError id="booking-address-error">
                      {errors.address}
                    </FieldError>
                  </Field>
                </div>
              </FieldGroup>
            </section>

            <Separator />

            <section aria-labelledby="booking-info-heading">
              <h3
                id="booking-info-heading"
                className="mb-4 text-sm font-semibold text-foreground"
              >
                Repair details
              </h3>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.preferredDate)}>
                  <FieldLabel htmlFor="booking-date">
                    <CalendarDays aria-hidden="true" />
                    Preferred date
                  </FieldLabel>
                  <Input
                    id="booking-date"
                    name="preferredDate"
                    type="date"
                    min={today}
                    value={values.preferredDate}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.preferredDate)}
                    aria-describedby={
                      errors.preferredDate
                        ? "booking-date-error"
                        : "booking-date-help"
                    }
                    required
                    disabled={isSubmitting}
                  />
                  <FieldDescription id="booking-date-help">
                    Choose today or a date in the future.
                  </FieldDescription>
                  <FieldError id="booking-date-error">
                    {errors.preferredDate}
                  </FieldError>
                </Field>

                <Field data-invalid={Boolean(errors.problemDescription)}>
                  <FieldLabel htmlFor="booking-problem">
                    Describe the repair issue
                  </FieldLabel>
                  <Textarea
                    id="booking-problem"
                    name="problemDescription"
                    placeholder="Tell the technician what is happening and when it started."
                    value={values.problemDescription}
                    onChange={handleChange}
                    minLength={20}
                    maxLength={2000}
                    rows={4}
                    aria-invalid={Boolean(errors.problemDescription)}
                    aria-describedby={
                      errors.problemDescription
                        ? "booking-problem-error"
                        : "booking-problem-help"
                    }
                    required
                    disabled={isSubmitting}
                  />
                  <FieldDescription id="booking-problem-help">
                    {values.problemDescription.trim().length}/20 minimum
                    characters
                  </FieldDescription>
                  <FieldError id="booking-problem-error">
                    {errors.problemDescription}
                  </FieldError>
                </Field>
              </FieldGroup>
            </section>
          </div>

          <DialogFooter className="px-5 sm:px-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
