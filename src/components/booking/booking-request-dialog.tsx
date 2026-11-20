"use client";

import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
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
  validateBookingRequest,
  type BookingRequestErrors,
} from "@/lib/booking-validation";
import type {
  BookingRequestPayload,
  BookingRequestValues,
  ServiceDetails,
} from "@/types/type";
import { useSession } from "@/lib/auth-client";

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

type BookingRequestTouched = Partial<
  Record<keyof BookingRequestValues, boolean>
>;

const BOOKING_REQUEST_TOAST_ID = "booking-request-submission";

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
  const [touched, setTouched] = useState<BookingRequestTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const today = getTodayDateInputValue();

  const { data: session } = useSession();
  const customerName = session?.user.name || "";
  const customerEmail = session?.user.email || "";
  const validationErrors = validateBookingRequest(values, today);
  const isFormValid =
    Boolean(customerName.trim() && customerEmail.trim()) &&
    Object.keys(validationErrors).length === 0;
  const visibleErrors = {
    phone: touched.phone ? errors.phone : undefined,
    address: touched.address ? errors.address : undefined,
    preferredDate: touched.preferredDate ? errors.preferredDate : undefined,
    problemDescription: touched.problemDescription
      ? errors.problemDescription
      : undefined,
  };

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    if (!nextOpen) {
      setValues({
        ...EMPTY_VALUES,
      });
      setErrors({});
      setTouched({});
      setSubmissionError("");
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

    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    if (touched[name]) {
      setErrors(validateBookingRequest(nextValues, today));
    }
  }

  function handleBlur(
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const name = event.currentTarget.name;

    if (
      name !== "phone" &&
      name !== "address" &&
      name !== "preferredDate" &&
      name !== "problemDescription"
    ) {
      return;
    }

    setTouched((previous) => ({ ...previous, [name]: true }));
    setErrors(validateBookingRequest(values, today));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmissionError("");
    const nextErrors = validateBookingRequest(values, today);
    setErrors(nextErrors);
    setTouched({
      phone: true,
      address: true,
      preferredDate: true,
      problemDescription: true,
    });

    if (!customerName.trim() || !customerEmail.trim()) {
      toast.add({
        type: "error",
        title: "Customer information unavailable",
        description: "Refresh the page and sign in again before requesting.",
      });
      return;
    }

    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      Object.keys(nextErrors).length > 0
    ) {
      return;
    }

    setIsSubmitting(true);

    const payload: BookingRequestPayload = {
      serviceId: service.service.id,
      phone: values.phone.trim(),
      address: values.address.trim(),
      preferredDate: values.preferredDate,
      problemDescription: values.problemDescription.trim(),
    };

    toast.add({
      id: BOOKING_REQUEST_TOAST_ID,
      type: "loading",
      title: "Submitting your repair request",
      description: "Please wait while we send your request.",
      timeout: 0,
    });
    try {
      const result = await createBookingRequest(payload);

      if (!result.success) {
        const message =
          result.result?.message ??
          "Please check your details and try again.";
        setSubmissionError(message);
        toast.update(BOOKING_REQUEST_TOAST_ID, {
          type: "error",
          title: "Couldn't submit your request",
          description: message,
          timeout: 8000,
        });
        return;
      }

      setValues({
        ...EMPTY_VALUES,
      });
      setErrors({});
      setTouched({});
      onOpenChange(false);
      toast.update(BOOKING_REQUEST_TOAST_ID, {
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
      const message =
        error instanceof Error
          ? error.message
          : "Please try again in a moment.";
      setSubmissionError(message);
      toast.update(BOOKING_REQUEST_TOAST_ID, {
        type: "error",
        title: "Couldn't submit your request",
        description: message,
        timeout: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className=" w-[calc(100%-2rem)]  overflow-y-auto p-0 lg:max-w-4xl overflow-x-hidden">
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
                  <Field data-invalid={Boolean(visibleErrors.phone)}>
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
                      onBlur={handleBlur}
                      value={values.phone}
                      aria-invalid={Boolean(visibleErrors.phone)}
                      aria-describedby={
                        visibleErrors.phone ? "booking-phone-error" : undefined
                      }
                      required
                      disabled={isSubmitting}
                    />
                    <FieldError id="booking-phone-error">
                      {visibleErrors.phone}
                    </FieldError>
                  </Field>

                  <Field data-invalid={Boolean(visibleErrors.address)}>
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
                      onBlur={handleBlur}
                      aria-invalid={Boolean(visibleErrors.address)}
                      aria-describedby={
                        visibleErrors.address
                          ? "booking-address-error"
                          : undefined
                      }
                      required
                      disabled={isSubmitting}
                    />
                    <FieldError id="booking-address-error">
                      {visibleErrors.address}
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
                <Field data-invalid={Boolean(visibleErrors.preferredDate)}>
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
                    onBlur={handleBlur}
                    aria-invalid={Boolean(visibleErrors.preferredDate)}
                    aria-describedby={
                      visibleErrors.preferredDate
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
                    {visibleErrors.preferredDate}
                  </FieldError>
                </Field>

                <Field data-invalid={Boolean(visibleErrors.problemDescription)}>
                  <FieldLabel htmlFor="booking-problem">
                    Describe the repair issue
                  </FieldLabel>
                  <Textarea
                    id="booking-problem"
                    name="problemDescription"
                    placeholder="Tell the technician what is happening and when it started."
                    value={values.problemDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    minLength={20}
                    maxLength={2000}
                    rows={4}
                    aria-invalid={Boolean(visibleErrors.problemDescription)}
                    aria-describedby={
                      visibleErrors.problemDescription
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
                    {visibleErrors.problemDescription}
                  </FieldError>
                </Field>
              </FieldGroup>
            </section>
          </div>

          {submissionError ? (
            <p
              role="alert"
              className="mx-5 mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive sm:mx-6"
            >
              {submissionError}
            </p>
          ) : null}

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
              disabled={isSubmitting || !isFormValid}
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
