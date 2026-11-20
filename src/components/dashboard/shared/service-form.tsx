"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { uploadToImgBB } from "@/lib/imgbb";
import {
  SERVICE_CATEGORIES,
  SERVICE_MODE_LABELS,
  SERVICE_MODE_OPTIONS,
} from "@/lib/dashboard-data";
import {
  MAX_SERVICE_IMAGE_BYTES,
  SERVICE_IMAGE_TYPES,
  validateServiceForm,
} from "@/lib/validation";
import type {
  ServiceFormErrors,
  ServiceFormProps,
  ServiceFormValues,
  ServiceMode,
  TechnicianService,
} from "@/types/type";

const EMPTY_VALUES: ServiceFormValues = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "home-visit",
  serviceArea: "",
  image: "",
};

function toFormValues(service: TechnicianService): ServiceFormValues {
  return {
    title: service.title,
    category: service.category,
    description: service.description,
    basePrice: service.basePrice ? String(service.basePrice) : "",
    estimatedDuration: service.estimatedDuration,
    serviceMode: service.serviceMode,
    serviceArea: service.serviceArea,
    image: service.image ?? "",
  };
}

export function ServiceForm({
  service,
  technician,
  onSubmit,
}: ServiceFormProps) {
  const isEditing = service != null;
  const [values, setValues] = useState<ServiceFormValues>(() =>
    service ? toFormValues(service) : { ...EMPTY_VALUES },
  );
  const [errors, setErrors] = useState<ServiceFormErrors>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  /** Ignores responses from uploads the user replaced mid-flight. */
  const uploadIdRef = useRef(0);

  function setField<K extends keyof ServiceFormValues>(
    field: K,
    value: ServiceFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setField(name as keyof ServiceFormValues, value);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      !SERVICE_IMAGE_TYPES.includes(
        file.type as (typeof SERVICE_IMAGE_TYPES)[number],
      )
    ) {
      setErrors((previous) => ({
        ...previous,
        image: "Use a PNG, JPEG, or WebP image.",
      }));
      return;
    }

    if (file.size > MAX_SERVICE_IMAGE_BYTES) {
      setErrors((previous) => ({
        ...previous,
        image: "The image must be 5 MB or smaller.",
      }));
      return;
    }

    setErrors((previous) => ({ ...previous, image: undefined }));
    setIsUploadingImage(true);

    const currentUploadId = ++uploadIdRef.current;

    // Show the picked file right away; the ImgBB URL replaces it below.
    const reader = new FileReader();

    reader.onload = () => {
      if (
        currentUploadId === uploadIdRef.current &&
        typeof reader.result === "string"
      ) {
        setField("image", reader.result);
      }
    };

    reader.readAsDataURL(file);

    uploadToImgBB(file)
      .then((url) => {
        if (currentUploadId !== uploadIdRef.current) {
          return;
        }

        setField("image", url);
      })
      .catch((error: unknown) => {
        if (currentUploadId !== uploadIdRef.current) {
          return;
        }

        // Never keep a local preview for an image that wasn't uploaded.
        setField("image", "");
        setErrors((previous) => ({
          ...previous,
          image:
            error instanceof Error
              ? error.message
              : "ImgBB couldn't upload that image. Please try again.",
        }));
        toast.add({
          type: "error",
          title: "Couldn't upload your image",
          description:
            "Please choose the image again, or try a different file.",
        });
      })
      .finally(() => {
        if (currentUploadId === uploadIdRef.current) {
          setIsUploadingImage(false);
        }
      });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isUploadingImage) {
      return;
    }

    const nextErrors = validateServiceForm(values, {
      requireImage: !isEditing,
    });
    setErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0];

    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    onSubmit(values);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.title)}>
            <FieldLabel htmlFor="title">Service title</FieldLabel>
            <Input
              id="title"
              name="title"
              placeholder="iPhone Screen Replacement"
              value={values.title}
              onChange={handleChange}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              className="h-10 px-3"
            />
            <FieldError id="title-error">{errors.title}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.category)}>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select
              value={values.category}
              onValueChange={(value) => setField("category", value ?? "")}
            >
              <SelectTrigger
                id="category"
                className="h-10! w-full"
                aria-invalid={Boolean(errors.category)}
                aria-describedby={
                  errors.category ? "category-error" : undefined
                }
              >
                <SelectValue>
                  {values.category || "Choose a category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="category-error">{errors.category}</FieldError>
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Explain what the repair includes, which devices you cover, and what the customer should expect."
            value={values.description}
            onChange={handleChange}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            className="min-h-24 px-3 py-2"
          />
          <FieldError id="description-error">{errors.description}</FieldError>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.basePrice)}>
            <FieldLabel htmlFor="basePrice">Base price (USD)</FieldLabel>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              inputMode="decimal"
              min="1"
              step="1"
              placeholder="89"
              value={values.basePrice}
              onChange={handleChange}
              aria-invalid={Boolean(errors.basePrice)}
              aria-describedby={
                errors.basePrice ? "basePrice-error" : undefined
              }
              className="h-10 px-3"
            />
            <FieldError id="basePrice-error">{errors.basePrice}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.estimatedDuration)}>
            <FieldLabel htmlFor="estimatedDuration">
              Estimated duration
            </FieldLabel>
            <Input
              id="estimatedDuration"
              name="estimatedDuration"
              placeholder="45–60 minutes"
              value={values.estimatedDuration}
              onChange={handleChange}
              aria-invalid={Boolean(errors.estimatedDuration)}
              aria-describedby={
                errors.estimatedDuration ? "estimatedDuration-error" : undefined
              }
              className="h-10 px-3"
            />
            <FieldError id="estimatedDuration-error">
              {errors.estimatedDuration}
            </FieldError>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="serviceMode">Service mode</FieldLabel>
            <Select
              value={values.serviceMode}
              onValueChange={(value) =>
                setField("serviceMode", (value ?? "home-visit") as ServiceMode)
              }
            >
              <SelectTrigger id="serviceMode" className="h-10! w-full">
                <SelectValue>
                  {SERVICE_MODE_LABELS[values.serviceMode]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SERVICE_MODE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Choose whether you travel to the customer or they drop the device
              off.
            </FieldDescription>
          </Field>

          <Field data-invalid={Boolean(errors.serviceArea)}>
            <FieldLabel htmlFor="serviceArea">Service area</FieldLabel>
            <Input
              id="serviceArea"
              name="serviceArea"
              placeholder="Dhanmondi, Dhaka"
              value={values.serviceArea}
              onChange={handleChange}
              aria-invalid={Boolean(errors.serviceArea)}
              aria-describedby={
                errors.serviceArea ? "serviceArea-error" : undefined
              }
              className="h-10 px-3"
            />
            <FieldError id="serviceArea-error">{errors.serviceArea}</FieldError>
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.image)}>
          <FieldLabel htmlFor="image">Service image</FieldLabel>

          <div className="flex flex-wrap items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-slate-50 bg-cover bg-center text-muted-foreground dark:bg-slate-900"
              style={
                values.image
                  ? { backgroundImage: `url(${values.image})` }
                  : undefined
              }
            >
              {values.image ? null : isUploadingImage ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Input
                id="image"
                name="image"
                type="file"
                accept={SERVICE_IMAGE_TYPES.join(",")}
                onChange={handleImageChange}
                aria-invalid={Boolean(errors.image)}
                aria-describedby="image-description"
                className="h-10 cursor-pointer file:mr-3"
              />
              <FieldDescription id="image-description">
                PNG, JPEG, or WebP up to 5 MB — uploaded to ImgBB.
              </FieldDescription>
            </div>
          </div>

          <FieldError id="image-error">{errors.image}</FieldError>
        </Field>

        <div className="grid gap-5 rounded-xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="technicianName">Technician name</FieldLabel>
            <Input
              id="technicianName"
              value={technician.name}
              readOnly
              disabled
              className="h-10 px-3"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="technicianEmail">Email</FieldLabel>
            <Input
              id="technicianEmail"
              type="email"
              value={technician.email}
              readOnly
              disabled
              className="h-10 px-3"
            />
          </Field>

          <p className="text-xs text-muted-foreground sm:col-span-2">
            These come from your signed-in account and cannot be edited here.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="submit"
            disabled={isUploadingImage}
            className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
          >
            {isUploadingImage ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Uploading image…
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Submit for approval"
            )}
          </Button>
        </div>

        {isEditing ? (
          <p className="text-xs text-muted-foreground">
            Saving an edit sends the service back to admin approval.
          </p>
        ) : null}
      </FieldGroup>
    </form>
  );
}
